import React from 'react';
import { useCart } from '../context/CartContext';
import '../styles/CartSidebar.css';

const CartSidebar = () => {
    const {
        isCartOpen,
        toggleCart,
        cartItems,
        removeFromCart,
        updateQuantity,
        cartTotal,
        openCheckout
    } = useCart();

    if (!isCartOpen) return null;

    return (
        <div className="cart-overlay">
            <div className="cart-sidebar glass">
                <div className="cart-header">
                    <h2>Seu Pedido</h2>
                    <button className="close-btn" onClick={toggleCart}>&times;</button>
                </div>

                <div className="cart-items">
                    {cartItems.length === 0 ? (
                        <p className="empty-cart">Seu carrinho está vazio.</p>
                    ) : (
                        cartItems.map(item => (
                            <div key={item.id} className="cart-item">
                                <img
                                    src={item.image_type === 'local' ? `/images/${item.image}` : item.image}
                                    alt={item.name}
                                    className="cart-item-img"
                                    onError={(e) => { e.target.onerror = null; e.target.src = '/images/placeholder.png'; }}
                                />
                                <div className="cart-item-details">
                                    <h3>{item.name}</h3>
                                    <p className="cart-item-price">R$ {item.price.toFixed(2)}</p>
                                    <div className="quantity-controls">
                                        <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                                    </div>
                                </div>
                                <button
                                    className="remove-btn"
                                    onClick={() => removeFromCart(item.id)}
                                >
                                    &times;
                                </button>
                            </div>
                        ))
                    )}
                </div>

                <div className="cart-footer">
                    <div className="cart-total">
                        <span>Total:</span>
                        <span className="total-price">R$ {cartTotal.toFixed(2)}</span>
                    </div>
                    <button
                        className="btn btn-primary checkout-btn"
                        onClick={openCheckout}
                        disabled={cartItems.length === 0}
                    >
                        Finalizar Pedido
                    </button>
                </div>
            </div>
            <div className="cart-backdrop" onClick={toggleCart}></div>
        </div>
    );
};

export default CartSidebar;
