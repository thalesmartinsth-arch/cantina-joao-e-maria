import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { supabase } from '../supabaseClient';
import '../styles/CheckoutModal.css';

const CheckoutModal = () => {
    const cartCtx = useCart();

    if (!cartCtx) return null;

    const { isCheckoutOpen, closeCheckout, cartItems = [], cartTotal = 0, clearCart } = cartCtx;

    const [formData, setFormData] = useState({
        guardianName: '',
        studentName: '',
        className: '',
        phone: '',
        paymentMethod: 'pix' // default
    });

    const [orderSuccess, setOrderSuccess] = useState(null); // { id: '...', method: 'pix'|'money' }

    const [loading, setLoading] = useState(false);
    const [pixData, setPixData] = useState(null); // { qr_code, qr_code_base64, id }
    const [paymentStatus, setPaymentStatus] = useState('pending'); // pending, approved

    if (!isCheckoutOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleGeneratePix = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data, error } = await supabase.functions.invoke('create-payment', {
                body: {
                    items: cartItems.map(item => ({
                        id: item.id,
                        title: item.name,
                        quantity: item.quantity,
                        unit_price: item.price,
                        price: item.price // Sending both for compatibility
                    })),
                    payer: {
                        name: formData.guardianName,
                        email: 'cliente@lanchonete.com' // Placeholder or ask user
                    }
                }
            });

            if (error) throw error;
            console.log("PIX Generated:", data);
            setPixData(data);

            // Start Polling
            startPolling(data.id);

        } catch (error) {
            console.error('Error generating PIX:', error);
            const detailedError = error.message || (error.context && error.context.message) || JSON.stringify(error);
            alert(`Erro ao gerar PIX: ${detailedError}`);
        } finally {
            setLoading(false);
        }
    };

    const startPolling = (paymentId) => {
        const intervalId = setInterval(async () => {
            const { data, error } = await supabase.functions.invoke('check-payment', {
                body: { payment_id: paymentId }
            });

            if (data && data.status === 'approved') {
                clearInterval(intervalId);
                setPaymentStatus('approved');
                // Small delay to show success status before finalizing
                setTimeout(() => finalizeOrder(paymentId), 1500);
            }
        }, 5000); // Check every 5 seconds

        // Cleanup interval on unmount or close (handled by effect ideally, but simplified here)
        // Note: In real app, use useRef for intervalId to clear it properly on close.
    };

    const [lastOrderDetails, setLastOrderDetails] = useState(null); // { id, total, items, method }

    const finalizeOrder = async (paymentId = null) => {
        try {
            setLoading(true);
            // 1. Salvar no Supabase
            // Status 'paid' means payment confirmed, but order is NOT finished (approved).
            // Admin will change 'paid' -> 'approved' (Done).
            const orderStatus = 'paid';

            const { data: orderData, error: orderError } = await supabase
                .from('orders')
                .insert([{
                    customer_name: formData.guardianName,
                    customer_phone: formData.phone,
                    items: cartItems,
                    total_amount: cartTotal,
                    payment_method: formData.paymentMethod,
                    status: orderStatus,
                    delivery_info: {
                        student: formData.studentName,
                        class: formData.className
                    },
                    payment_id: paymentId
                }])
                .select()
                .single();

            if (orderError) throw orderError;

            const orderId = orderData.id.split('-')[0].toUpperCase();

            // Store details for WhatsApp BEFORE clearing cart
            setLastOrderDetails({
                id: orderId,
                total: cartTotal,
                items: [...cartItems],
                method: 'pix',
                guardianName: formData.guardianName
            });

            // Success! Show confirmation screen instead of redirecting
            setOrderSuccess({ id: orderId, method: 'pix' });
            setPixData(null);
            clearCart();
            // Don't close checkout yet, let user see success screen

        } catch (error) {
            console.error('Erro ao finalizar:', error);
            alert('Erro ao finalizar pedido.');
        } finally {
            setLoading(false);
        }
    };

    // For Money Payment (Manual)
    const handleManualSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const orderDataLocal = {
            customer_name: formData.guardianName,
            customer_phone: formData.phone,
            items: cartItems,
            total_amount: cartTotal,
            payment_method: 'money',
            status: 'pending',
            delivery_info: { student: formData.studentName, class: formData.className }
        };

        try {
            const { data, error } = await supabase.from('orders').insert([orderDataLocal]).select().single();
            if (error) throw error;

            const orderId = data.id.split('-')[0].toUpperCase();

            // Store details for WhatsApp BEFORE clearing cart
            setLastOrderDetails({
                id: orderId,
                total: cartTotal,
                items: [...cartItems],
                method: 'money',
                guardianName: formData.guardianName
            });

            // Success!
            setOrderSuccess({ id: orderId, method: 'money' });
            clearCart();

        } catch (e) {
            console.error(e);
            alert("Erro ao enviar pedido.");
        } finally {
            setLoading(false);
        }
    };

    // Function to manually open WhatsApp if user wants to
    const openWhatsApp = () => {
        if (!orderSuccess || !lastOrderDetails) return;

        const { id, total, items, method, guardianName } = lastOrderDetails;

        let itemsList = items.map(i => `  • ${i.quantity}x ${i.name}`).join('\n');

        const message = method === 'pix'
            ? `✅ *Pedido Confirmado!* 🍔 \n🆔 *Pedido #:* ${id}\n👤 *Responsável:* ${guardianName}\n💰 *Pagamento:* PIX (Pago)\n💲 *Total:* R$ ${total.toFixed(2)}\n\n📋 *Itens:*\n${itemsList}`
            : `👋 *Novo Pedido - Dinheiro* 🍔\n🆔 *Pedido #:* ${id}\n👤 *Responsável:* ${guardianName}\n💰 *Pagamento:* Dinheiro\n💲 *Total:* R$ ${total.toFixed(2)}\n\n📋 *Itens:*\n${itemsList}`;

        const phoneNumber = "55" + formData.phone.replace(/\D/g, '');
        window.open(`https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`, '_blank');
    };

    const handleClose = () => {
        setOrderSuccess(null);
        setPixData(null);
        setPaymentStatus('pending');
        setLoading(false);
        closeCheckout(); // from context
    };

    return (
        <div className="checkout-overlay">
            <div className="checkout-modal glass">
                <div className="checkout-header">
                    <h2>
                        {orderSuccess ? 'Pedido Realizado! 🎉' : 'Finalizar Pedido'}
                    </h2>
                    <button className="close-btn" onClick={handleClose}>&times;</button>
                </div>

                {orderSuccess ? (
                    <div className="success-container">
                        <div className="success-icon">✅</div>
                        <h3>Obrigado, {formData.guardianName}!</h3>
                        <p>Seu pedido <strong>#{orderSuccess.id}</strong> foi recebido com sucesso.</p>

                        <div className="success-actions">
                            <button className="btn btn-primary" onClick={handleClose}>
                                Fechar e Voltar ao Cardápio
                            </button>
                            <button className="btn btn-secondary whatsapp-btn" onClick={openWhatsApp}>
                                Enviar Comprovante no WhatsApp 💬
                            </button>
                        </div>
                    </div>
                ) : !pixData ? (
                    <form onSubmit={formData.paymentMethod === 'pix' ? handleGeneratePix : handleManualSubmit} className="checkout-form">
                        <div className="form-group">
                            <label>Nome do Responsável</label>
                            <input required name="guardianName" value={formData.guardianName} onChange={handleChange} placeholder="Ex: Maria" />
                        </div>
                        <div className="form-group-row">
                            <div className="form-group">
                                <label>Aluno</label>
                                <input required name="studentName" value={formData.studentName} onChange={handleChange} placeholder="Ex: João" />
                            </div>
                            <div className="form-group">
                                <label>Turma</label>
                                <input required name="className" value={formData.className} onChange={handleChange} placeholder="3º B" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Telefone (WhatsApp)</label>
                            <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="(XX) 99999-9999" />
                        </div>

                        <div className="form-group">
                            <label>Forma de Pagamento</label>
                            <div className="payment-options">
                                <label className={`radio-label ${formData.paymentMethod === 'pix' ? 'selected' : ''}`}>
                                    <input type="radio" name="paymentMethod" value="pix" checked={formData.paymentMethod === 'pix'} onChange={handleChange} />
                                    <span>💠 PIX</span>
                                </label>
                                <label className={`radio-label ${formData.paymentMethod === 'money' ? 'selected' : ''}`}>
                                    <input type="radio" name="paymentMethod" value="money" checked={formData.paymentMethod === 'money'} onChange={handleChange} />
                                    <span>💵 Dinheiro</span>
                                </label>
                            </div>
                        </div>

                        <div className="checkout-summary">
                            <p>Total: <strong>R$ {cartTotal.toFixed(2)}</strong></p>
                        </div>

                        <button type="submit" className="btn btn-primary submit-btn" disabled={loading}>
                            {loading ? 'Processando...' : (formData.paymentMethod === 'pix' ? 'Gerar PIX 💠' : 'Finalizar Pedido 🚀')}
                        </button>
                    </form>
                ) : (
                    <div className="pix-container">
                        <h3>Pagamento via PIX</h3>
                        <p>Escaneie o QR Code ou copie o código abaixo:</p>

                        {pixData.qr_code_base64 && (
                            <img src={`data:image/png;base64,${pixData.qr_code_base64}`} alt="QR Code PIX" className="pix-qrcode" />
                        )}

                        <div className="pix-code-box">
                            <input type="text" readOnly value={pixData.qr_code} />
                            <button onClick={() => navigator.clipboard.writeText(pixData.qr_code)}>Copiar</button>
                        </div>

                        <div className="pix-status">
                            {paymentStatus === 'pending' && <p className="status-pending">⏳ Aguardando pagamento...</p>}
                            {paymentStatus === 'approved' && <p className="status-success">✅ Pagamento Aprovado!</p>}
                        </div>

                        <button className="btn btn-secondary" onClick={() => setPixData(null)}>Voltar</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CheckoutModal;
