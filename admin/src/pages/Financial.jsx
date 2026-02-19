import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import Header from '../components/Header';
import { TrendingUp, Calendar, DollarSign, CreditCard } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import './Financial.css';

const Financial = () => {
    const [stats, setStats] = useState({
        todayTotal: 0,
        todayCount: 0,
        monthTotal: 0,
        monthCount: 0,
        pixTotal: 0,
        moneyTotal: 0,
        topItems: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFinancialData();
    }, []);

    const fetchFinancialData = async () => {
        setLoading(true);
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

            // Fetch Approved Orders Only
            const { data: orders, error } = await supabase
                .from('orders')
                .select('*')
                .eq('status', 'approved');

            if (error) throw error;

            let todayTotal = 0;
            let todayCount = 0;
            let monthTotal = 0;
            let monthCount = 0;
            let pixTotal = 0;
            let moneyTotal = 0;
            const itemCounts = {};

            orders.forEach(order => {
                const orderDate = new Date(order.created_at);
                const amount = parseFloat(order.total_amount) || 0;

                // Month Stats
                if (orderDate >= firstDayOfMonth) {
                    monthTotal += amount;
                    monthCount++;

                    // Payment Method Stats (Monthly)
                    if (order.payment_method === 'pix') pixTotal += amount;
                    else moneyTotal += amount;

                    // Parse items for chart (Monthly data)
                    if (Array.isArray(order.items)) {
                        order.items.forEach(item => {
                            const itemName = item.name.split('(')[0].trim(); // Group by base name
                            itemCounts[itemName] = (itemCounts[itemName] || 0) + (item.quantity || 1);
                        });
                    }
                }

                // Today Stats
                if (orderDate >= today) {
                    todayTotal += amount;
                    todayCount++;
                }
            });

            // Convert to array and sort
            const topItems = Object.entries(itemCounts)
                .map(([name, value]) => ({ name, value }))
                .sort((a, b) => b.value - a.value)
                .slice(0, 5); // Top 5

            setStats({
                todayTotal,
                todayCount,
                monthTotal,
                monthCount,
                pixTotal,
                moneyTotal,
                topItems
            });

        } catch (error) {
            console.error('Erro ao buscar dados financeiros:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="financial-container">
            <Header />

            <main className="financial-main">
                <div className="financial-header">
                    <h2>Financeiro</h2>
                    <p style={{ color: 'var(--color-text-muted)' }}>
                        Visão geral do faturamento (apenas pedidos marcados como "Pronto")
                    </p>
                </div>

                {loading ? (
                    <p>Carregando métricas...</p>
                ) : (
                    <>
                        <>
                            <div className="dashboard-grid">
                                <div className="stat-card today">
                                    <span className="stat-label">Faturamento Hoje</span>
                                    <span className="stat-value">R$ {stats.todayTotal.toFixed(2)}</span>
                                    <span className="stat-subtext">
                                        <TrendingUp size={16} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                                        {stats.todayCount} pedidos concluídos
                                    </span>
                                </div>

                                <div className="stat-card month">
                                    <span className="stat-label">Faturamento Mensal</span>
                                    <span className="stat-value">R$ {stats.monthTotal.toFixed(2)}</span>
                                    <span className="stat-subtext">
                                        <Calendar size={16} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                                        {stats.monthCount} pedidos este mês
                                    </span>
                                </div>

                                <div className="stat-card total">
                                    <span className="stat-label">Ticket Médio (Mês)</span>
                                    <span className="stat-value">
                                        R$ {stats.monthCount > 0 ? (stats.monthTotal / stats.monthCount).toFixed(2) : '0.00'}
                                    </span>
                                    <span className="stat-subtext">
                                        Média por pedido
                                    </span>
                                </div>
                            </div>

                            <div className="charts-row">
                                <div className="chart-section" style={{ flex: 2 }}>
                                    <div className="chart-header">
                                        <h3>Top 5 Produtos Mais Vendidos</h3>
                                    </div>
                                    <div style={{ width: '100%', height: 300 }}>
                                        <ResponsiveContainer>
                                            <BarChart data={stats.topItems} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                                <XAxis type="number" hide />
                                                <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 12 }} />
                                                <Tooltip formatter={(value) => [`${value} unidades`, 'Vendas']} />
                                                <Bar dataKey="value" fill="var(--color-primary)" radius={[0, 4, 4, 0]} barSize={20} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                <div className="chart-section" style={{ flex: 1 }}>
                                    <div className="chart-header">
                                        <h3>Pagamentos (Mês)</h3>
                                    </div>

                                    <div className="payment-method-stats">
                                        <div className="payment-stat">
                                            <h4><div style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: '#3b82f6', marginRight: '5px' }}></div>PIX</h4>
                                            <p>R$ {stats.pixTotal.toFixed(2)}</p>
                                        </div>
                                        <div className="payment-stat">
                                            <h4><div style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', marginRight: '5px' }}></div>Dinheiro</h4>
                                            <p>R$ {stats.moneyTotal.toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                )}
                    </main>
        </div>
    );
};

export default Financial;
