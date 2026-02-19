import React from 'react';
import './DailySummary.css';

const DailySummary = ({ date, orders }) => {
    // Format Date for Display
    const dateOptions = { weekday: 'long', day: 'numeric', month: 'long' };
    const dateString = date.toLocaleDateString('pt-BR', dateOptions);
    const [weekDay, ...rest] = dateString.split(' ');
    const displayDate = rest.join(' ');

    // Calculate Metrics
    const totalRevenue = orders.reduce((acc, order) => {
        // Only count approved items for revenue, or maybe all active?
        // User asked for "Faturamento", usually implies actual money.
        // Let's count 'paid' and 'approved'. 'pending' money is not yet revenue.
        // Actually, to match the "Active Orders" view, let's sum everything
        // but maybe differentiate?
        // Reference image shows "Faturamento". Let's sum everything valid (paid/pending/approved).
        if (order.status !== 'rejected' && order.status !== 'cancelled') {
            return acc + (parseFloat(order.total_amount) || 0);
        }
        return acc;
    }, 0);

    const totalOrders = orders.filter(o => o.status !== 'cancelled' && o.status !== 'rejected').length;
    const completedOrders = orders.filter(o => o.status === 'approved').length;

    let completionRate = 0;
    if (totalOrders > 0) {
        completionRate = Math.round((completedOrders / totalOrders) * 100);
    }

    return (
        <div className="daily-summary-card">
            <div className="summary-left">
                <span className="summary-label">Resumo do Dia</span>
                <h2 className="summary-date">
                    <span className="capitalize">{weekDay}</span>
                    <span className="date-detail">, {displayDate}</span>
                </h2>
            </div>

            <div className="summary-right">
                <div className="metric-box">
                    <span className="metric-label">FATURAMENTO</span>
                    <span className="metric-value">
                        {totalRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                </div>
                <div className="metric-divider"></div>
                <div className="metric-box">
                    <span className="metric-label">CONCLUÍDOS</span>
                    <span className="metric-value">{completionRate}%</span>
                </div>
            </div>
        </div>
    );
};

export default DailySummary;
