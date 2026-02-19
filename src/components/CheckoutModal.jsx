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

    if (!isCheckoutOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const finalizeOrder = async (e) => {
        e.preventDefault();

        try {
            // 1. Salvar no Supabase
            const { data: orderData, error: orderError } = await supabase
                .from('orders')
                .insert([{
                    customer_name: formData.guardianName,
                    customer_phone: formData.phone,
                    items: cartItems,
                    total_amount: cartTotal,
                    payment_method: formData.paymentMethod,
                    status: 'pending',
                    delivery_info: {
                        student: formData.studentName,
                        class: formData.className
                    }
                }])
                .select()
                .single();

            if (orderError) throw orderError;

            const orderId = orderData.id.split('-')[0].toUpperCase();

            // 2. Montar Mensagem WhatsApp
            let itemsList = cartItems.map(item => {
                let itemText = `▫️ ${item.quantity}x ${item.name} (${item.selectedOption || 'Padrão'})`;
                return itemText;
            }).join('\n');

            const paymentDescription = formData.paymentMethod === 'pix'
                ? 'PIX (Chave enviada na conversa)'
                : 'Dinheiro (Pagar na entrega)';

            const message = `👋 *Novo Pedido - Cantina João e Maria* 🍔
            
🆔 *Pedido #:* ${orderId}
👤 *Responsável:* ${formData.guardianName}
🎓 *Aluno:* ${formData.studentName}
🏫 *Turma:* ${formData.className}
💰 *Pagamento:* ${paymentDescription}

🛒 *Itens:*
${itemsList}

💲 *Total:* R$ ${cartTotal.toFixed(2)}`;

            const phoneNumber = "55" + formData.phone.replace(/\D/g, '');
            const encodedMessage = encodeURIComponent(message);

            // 3. Abrir WhatsApp
            window.open(`https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`, '_blank');

            clearCart();
            closeCheckout();

        } catch (error) {
            console.error('Erro ao salvar pedido:', error);
            alert('Erro ao processar pedido. Tente novamente.');
        }
    };

    return (
        <div className="checkout-overlay">
            <div className="checkout-modal glass">
                <div className="checkout-header">
                    <h2>Finalizar Pedido</h2>
                    <button className="close-btn" onClick={closeCheckout}>&times;</button>
                </div>

                <form onSubmit={finalizeOrder} className="checkout-form">
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
                        {formData.paymentMethod === 'pix' && (
                            <p style={{ fontSize: '0.85rem', color: '#ccc', marginTop: '5px' }}>
                                * A chave PIX será informada no WhatsApp.
                            </p>
                        )}
                    </div>

                    <div className="checkout-summary">
                        <p>Total: <strong>R$ {cartTotal.toFixed(2)}</strong></p>
                    </div>

                    <button type="submit" className="btn btn-primary submit-btn">
                        Enviar Pedido no WhatsApp 🚀
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CheckoutModal;
