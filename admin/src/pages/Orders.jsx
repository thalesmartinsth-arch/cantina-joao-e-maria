import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import Header from '../components/Header';
import ConfirmationModal from '../components/ConfirmationModal';
import './Orders.css';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalConfig, setModalConfig] = useState({
        isOpen: false, title: '', message: '', confirmText: '', isDestructive: false, onConfirm: () => { }
    });

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .in('status', ['pending', 'paid'])
                .order('created_at', { ascending: false })
                .limit(50);

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
            fetchOrders();
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
        // PIX with payment_id implies paid. Money is pending until delivery.
        if (order.payment_method === 'pix' && order.payment_id) {
            return { label: '✅ Pagamento Realizado', className: 'pay-status-paid' };
        }
        if (order.payment_method === 'money') {
            return { label: '⚠️ Pagamento Pendente', className: 'pay-status-pending' };
        }
        // Fallback for Pix without ID (shouldn't happen) or other cases
        return { label: '❓ Verificar Pagamento', className: 'pay-status-unknown' };
    };

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
                <div className="orders-header">
                    <h2>Pedidos Ativos</h2>
                    <button className="refresh-btn" onClick={() => fetchOrders()}>
                        &#x21bb; Atualizar
                    </button>
                </div>

                {loading && <p style={{ textAlign: 'center', padding: '20px' }}>Carregando...</p>}

                {!loading && orders.length === 0 && (
                    <div className="empty-state">
                        <p>Nenhum pedido ativo.</p>
                    </div>
                )}

                <div className="orders-grid">
                    {orders.map((order) => {
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

                                <div className="order-actions-row">
                                    <button className="action-btn btn-approve" onClick={() => handleUpdateStatus(order.id, 'approved')}>
                                        PRONTO
                                    </button>
                                    <button className="action-btn btn-reject" onClick={() => handleUpdateStatus(order.id, 'rejected')}>
                                        CANCELAR
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </main>
        </div>
    );
};

export default Orders;
