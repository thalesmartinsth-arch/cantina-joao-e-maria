
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import Header from '../components/Header';
import { Printer, Calendar, Search } from 'lucide-react';
import './History.css';

const History = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        fetchHistory();
    }, [startDate, endDate]);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            // Adjust dates for comparison
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);

            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);

            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .gte('created_at', start.toISOString())
                .lte('created_at', end.toISOString())
                .order('created_at', { ascending: false });

            if (error) throw error;
            setOrders(data);
        } catch (error) {
            console.error('Erro ao buscar histórico:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('pt-BR');
    };

    const formatCurrency = (val) => {
        return 'R$ ' + parseFloat(val).toFixed(2);
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'approved': return <span className="status-badge bg-green">Concluído</span>;
            case 'pending': return <span className="status-badge bg-yellow">Pendente</span>;
            case 'rejected': return <span className="status-badge bg-red">Cancelado</span>;
            default: return <span className="status-badge">{status}</span>;
        }
    };

    const renderItems = (items) => {
        if (!Array.isArray(items)) return '-';
        return items.map(i => `${i.quantity}x ${i.name}`).join(', ');
    };

    return (
        <div className="history-container">
            <Header />

            <main className="history-main">
                <div className="history-header">
                    <h2>Histórico de Pedidos</h2>
                    <button onClick={handlePrint} className="btn-print">
                        <Printer size={18} /> Imprimir Relatório
                    </button>
                </div>

                <div className="filters-bar">
                    <div className="date-filter">
                        <label>De:</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                    <div className="date-filter">
                        <label>Até:</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                    <button className="btn" style={{ background: 'var(--color-primary)', color: 'white', padding: '0.5rem 1rem' }} onClick={fetchHistory}>
                        <Search size={18} /> Filtrar
                    </button>
                </div>

                <div className="history-table-container">
                    {loading ? (
                        <p style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</p>
                    ) : orders.length === 0 ? (
                        <p style={{ padding: '2rem', textAlign: 'center' }}>Nenhum pedido encontrado neste período.</p>
                    ) : (
                        <table className="history-table">
                            <thead>
                                <tr>
                                    <th>Data/Hora</th>
                                    <th>Resp. / Aluno</th>
                                    <th>Itens</th>
                                    <th>Pagamento</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order.id}>
                                        <td>{formatDate(order.created_at)}</td>
                                        <td>
                                            <strong>{order.customer_name}</strong><br />
                                            <span style={{ fontSize: '0.85em', color: '#666' }}>
                                                {order.delivery_info?.student} ({order.delivery_info?.class})
                                            </span>
                                        </td>
                                        <td style={{ maxWidth: '300px' }}>{renderItems(order.items)}</td>
                                        <td>{order.payment_method === 'pix' ? 'PIX' : 'Dinheiro'}</td>
                                        <td>{formatCurrency(order.total_amount)}</td>
                                        <td>{getStatusBadge(order.status)}</td>
                                    </tr>
                                ))}
                                <tr style={{ background: '#f9fafb', fontWeight: 'bold' }}>
                                    <td colSpan="4" style={{ textAlign: 'right' }}>Total do Período:</td>
                                    <td colSpan="2">
                                        {formatCurrency(orders.reduce((acc, curr) => acc + (parseFloat(curr.total_amount) || 0), 0))}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    )}
                </div>
            </main>
        </div>
    );
};

export default History;
