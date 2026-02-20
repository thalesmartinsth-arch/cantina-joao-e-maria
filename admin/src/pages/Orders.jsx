import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import Header from '../components/Header';
import ConfirmationModal from '../components/ConfirmationModal';
import DayPicker from '../components/DayPicker';
import DailySummary from '../components/DailySummary';
import './Orders.css';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Date Management
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [activityMap, setActivityMap] = useState(new Set());
    const [activeTab, setActiveTab] = useState('pending'); // 'pending', 'approved', 'rejected'

    const [modalConfig, setModalConfig] = useState({
        isOpen: false, title: '', message: '', confirmText: '', isDestructive: false, onConfirm: () => { }
    });

    useEffect(() => {
        fetchOrders(selectedDate);
        fetchMonthActivity(selectedDate);
    }, [selectedDate]);

    const fetchOrders = async (date) => {
        setLoading(true);
        try {
            // Start and End of selected day
            const start = new Date(date);
            start.setHours(0, 0, 0, 0);

            const end = new Date(date);
            end.setHours(23, 59, 59, 999);

            const { data, error } = await supabase
                .from('orders')
                .select('*')
                // Filter by DATE, not just status. We want to see EVERYTHING for that day.
                .gte('created_at', start.toISOString())
                .lte('created_at', end.toISOString())
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Supabase error:', error);
                setOrders([]);
            } else {
                setOrders(Array.isArray(data) ? data : []);
            }
        } catch (error) {
            console.error('Catch error:', error);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchMonthActivity = async (date) => {
        // Fetch headers only for the whole month to populate dots
        const year = date.getFullYear();
        const month = date.getMonth();
        const start = new Date(year, month, 1);
        const end = new Date(year, month + 1, 0, 23, 59, 59);

        const { data } = await supabase
            .from('orders')
            .select('created_at')
            .gte('created_at', start.toISOString())
            .lte('created_at', end.toISOString());

        if (data) {
            const newActivityMap = new Set();
            data.forEach(item => {
                const d = new Date(item.created_at);
                const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                newActivityMap.add(key);
            });
            setActivityMap(newActivityMap);
        }
    };

    const handleUpdateStatus = (id, newStatus) => {
        const title = newStatus === 'approved' ? 'Concluir Pedido' : 'Cancelar Pedido';
        const message = newStatus === 'approved'
            ? 'Marcar como entregue?'
            : 'Cancelar pedido?';

        setModalConfig({
            isOpen: true,
            title,
            message,
            confirmText: newStatus === 'approved' ? 'Confirmar' : 'Cancelar',
            isDestructive: newStatus !== 'approved',
            onConfirm: () => executeUpdate(id, newStatus)
        });
    };

    const executeUpdate = async (id, newStatus) => {
        try {
            await supabase.from('orders').update({ status: newStatus }).eq('id', id);
            fetchOrders(selectedDate); // Refresh current view
        } catch (error) {
            console.error(error);
            alert('Erro ao atualizar.');
        }
    };

    const formatCurrency = (val) => {
        try {
            const num = parseFloat(val);
            if (isNaN(num)) return 'R$ 0,00';
            return 'R$ ' + num.toFixed(2);
        } catch (e) { return 'R$ --'; }
    };

    const formatDate = (dateString) => {
        try {
            return new Date(dateString).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        } catch (e) { return '--:--'; }
    };

    const getPaymentStatus = (order) => {
        if (order.payment_method === 'pix' && order.payment_id) {
            return { label: '✅ Pagamento Realizado', className: 'pay-status-paid' };
        }
        if (order.payment_method === 'money') {
            return { label: '⚠️ Pagamento Pendente', className: 'pay-status-pending' };
        }
        return { label: '❓ Verificar Pagamento', className: 'pay-status-unknown' };
    };

    const filteredOrders = orders.filter(order => {
        if (activeTab === 'pending') return order.status === 'pending' || order.status === 'paid';
        if (activeTab === 'approved') return order.status === 'approved';
        if (activeTab === 'rejected') return order.status === 'rejected' || order.status === 'cancelled';
        return true;
    });

    return (
        <div className="orders-container">
            <Header />
            <ConfirmationModal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
                title={modalConfig.title}
                message={modalConfig.message}
                confirmText={modalConfig.confirmText}
                isDestructive={modalConfig.isDestructive}
                onConfirm={modalConfig.onConfirm}
            />

            <main className="orders-main">
                {/* New Components */}
                <DailySummary date={selectedDate} orders={orders} />

                <DayPicker
                    selectedDate={selectedDate}
                    onSelect={setSelectedDate}
                    activityMap={activityMap}
                />

                <div className="orders-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
                        onClick={() => setActiveTab('pending')}
                    >
                        ⚡ Pendentes ({orders.filter(o => o.status === 'pending' || o.status === 'paid').length})
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'approved' ? 'active' : ''}`}
                        onClick={() => setActiveTab('approved')}
                    >
                        ✅ Concluídos ({orders.filter(o => o.status === 'approved').length})
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'rejected' ? 'active' : ''}`}
                        onClick={() => setActiveTab('rejected')}
                    >
                        ❌ Cancelados ({orders.filter(o => o.status === 'rejected' || o.status === 'cancelled').length})
                    </button>
                </div>

                <div className="orders-header">
                    <h2>
                        {filteredOrders.length} {filteredOrders.length === 1 ? 'Pedido' : 'Pedidos'} na Aba
                    </h2>
                    <button className="refresh-btn" onClick={() => fetchOrders(selectedDate)}>
                        &#x21bb; Atualizar
                    </button>
                </div>

                {loading && <p style={{ textAlign: 'center', padding: '20px' }}>Carregando...</p>}

                {!loading && filteredOrders.length === 0 && (
                    <div className="empty-state">
                        <p>Nenhum pedido nesta aba para este dia.</p>
                    </div>
                )}

                <div className="orders-grid">
                    {filteredOrders.map((order) => {
                        const payStatus = getPaymentStatus(order);

                        return (
                            <div key={order.id || Math.random()} className={`order-card status-${order.status || 'pending'}`}>
                                <div className="order-header-row">
                                    <span className="order-id">#{typeof order.id === 'string' ? order.id.split('-')[0].toUpperCase() : order.id}</span>
                                    <span className="order-time">{formatDate(order.created_at)}</span>
                                </div>

                                <div className="customer-info">
                                    <div className="customer-name">{order.customer_name || 'Cliente'}</div>
                                    <div className="customer-details">
                                        {order.delivery_info?.student && <span>Aluno: {order.delivery_info.student}</span>}
                                        {order.delivery_info?.class && <span> • Turma: {order.delivery_info.class}</span>}
                                    </div>
                                </div>

                                <div className={`payment-status-badge ${payStatus.className}`}>
                                    {payStatus.label}
                                </div>

                                <div className="order-items-list">
                                    {Array.isArray(order.items) ? order.items.map((item, idx) => (
                                        <div key={idx} className="order-item-row">
                                            <span className="item-qty">{item.quantity}x</span>
                                            <span className="item-name">{item.name}</span>
                                        </div>
                                    )) : <p>Sem itens</p>}
                                </div>

                                <div className="order-total-row">
                                    <span className={`method-badge ${order.payment_method}`}>
                                        {order.payment_method === 'pix' ? '💠 PIX' : '💵 Dinheiro'}
                                    </span>
                                    <span className="total-value">{formatCurrency(order.total_amount)}</span>
                                </div>

                                {order.status !== 'approved' && order.status !== 'rejected' && order.status !== 'cancelled' && (
                                    <div className="order-actions-row">
                                        <button className="action-btn btn-approve" onClick={() => handleUpdateStatus(order.id, 'approved')}>
                                            PRONTO
                                        </button>
                                        <button className="action-btn btn-reject" onClick={() => handleUpdateStatus(order.id, 'rejected')}>
                                            CANCELAR
                                        </button>
                                    </div>
                                )}
                                {order.status === 'approved' && (
                                    <div className="order-status-finished">
                                        ✅ Pedido Concluído
                                    </div>
                                )}
                                {(order.status === 'rejected' || order.status === 'cancelled') && (
                                    <div className="order-status-cancelled">
                                        ❌ Pedido Cancelado
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </main>
        </div>
    );
};

export default Orders;
