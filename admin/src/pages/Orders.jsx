import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import Header from '../components/Header';
import ConfirmationModal from '../components/ConfirmationModal';
import { RefreshCw, Check, X, Clock } from 'lucide-react';
import './Orders.css';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        title: '',
        message: '',
        confirmText: '',
        isDestructive: false,
        onConfirm: () => { }
    });

    useEffect(() => {
        fetchOrders();
        // Polling para atualização automática a cada 30 segundos
        const interval = setInterval(fetchOrders, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            // Buscando pedidos do dia (ou todos recentes)
            // Ordenando pelos mais recentes primeiro
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(50); // Limite de 50 por enquanto

            if (error) throw error;
            setOrders(data);
        } catch (error) {
            console.error('Erro ao buscar pedidos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = (id, newStatus) => {
        if (newStatus === 'approved') {
            setModalConfig({
                isOpen: true,
                title: 'Concluir Pedido',
                message: 'Tem certeza que deseja marcar este pedido como pronto/entregue?',
                confirmText: 'Sim, Concluir',
                isDestructive: false,
                onConfirm: () => executeUpdate(id, newStatus)
            });
        } else {
            setModalConfig({
                isOpen: true,
                title: 'Cancelar Pedido',
                message: 'Tem certeza que deseja cancelar este pedido? Esta ação não pode ser desfeita.',
                confirmText: 'Sim, Cancelar',
                isDestructive: true,
                onConfirm: () => executeUpdate(id, newStatus)
            });
        }
    };

    const executeUpdate = async (id, newStatus) => {
        try {
            const { error } = await supabase
                .from('orders')
                .update({ status: newStatus })
                .eq('id', id);

            if (error) throw error;
            fetchOrders(); // Recarrega a lista
        } catch (error) {
            console.error('Erro ao atualizar status:', error);
            alert('Erro ao atualizar status.');
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) + ' - ' + date.toLocaleDateString('pt-BR');
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
                    <button className="refresh-btn" onClick={fetchOrders}>
                        <RefreshCw size={18} /> Atualizar
                    </button>
                </div>

                {loading && orders.length === 0 ? (
                    <p style={{ textAlign: 'center', marginTop: '2rem' }}>Carregando pedidos...</p>
                ) : (
                    <div className="orders-grid">
                        {orders.length === 0 ? (
                            <div className="empty-state">
                                <Clock size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                                <h3>Nenhum pedido encontrado</h3>
                                <p>Os pedidos feitos no app aparecerão aqui.</p>
                            </div>
                        ) : (
                            orders.map((order) => (
                                <div key={order.id} className={`order-card status-${order.status}`}>
                                    <div className="order-header">
                                        <span className="order-id">#{order.id.split('-')[0].toUpperCase()}</span>
                                        <span className="order-time">{formatDate(order.created_at)}</span>
                                    </div>

                                    <div className="customer-info">
                                        <div className="info-row">
                                            <span className="info-label">Aluno:</span>
                                            <span>{order.delivery_info?.student || 'N/A'}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="info-label">Turma:</span>
                                            <span>{order.delivery_info?.class || 'N/A'}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="info-label">Resp:</span>
                                            <span>{order.customer_name}</span>
                                        </div>
                                    </div>

                                    <div className="order-items">
                                        {Array.isArray(order.items) && order.items.map((item, idx) => (
                                            <div key={idx} className="item-row">
                                                <span>
                                                    <span className="item-quantity">{item.quantity}x</span>
                                                    {item.name}
                                                    {item.selectedOption && <span style={{ fontSize: '0.8em', color: '#666' }}> ({item.selectedOption})</span>}
                                                </span>
                                                <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="order-footer">
                                        <span className={`payment-method ${order.payment_method}`}>
                                            {order.payment_method === 'pix' ? '💠 PIX' : '💵 Dinheiro'}
                                        </span>
                                        <span className="total-amount">R$ {order.total_amount?.toFixed(2)}</span>
                                    </div>

                                    {order.status === 'pending' && (
                                        <div className="order-actions">
                                            <button className="action-btn btn-approve" onClick={() => handleUpdateStatus(order.id, 'approved')}>
                                                <Check size={18} /> Pronto
                                            </button>
                                            <button className="action-btn btn-reject" onClick={() => handleUpdateStatus(order.id, 'rejected')}>
                                                <X size={18} /> Cancelar
                                            </button>
                                        </div>
                                    )}
                                    {order.status !== 'pending' && (
                                        <div style={{ marginTop: '1rem', textAlign: 'center', fontWeight: 'bold', color: order.status === 'approved' ? '#10b981' : '#ef4444' }}>
                                            {order.status === 'approved' ? '✅ Pedido Concluído' : '❌ Pedido Cancelado'}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Orders;
