import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useCartAnimation } from '../context/CartAnimationContext';
import logo from '../assets/logo.png';
import { useTheme } from '../context/ThemeContext';
import '../styles/Header.css';

const Header = () => {
    const { cartCount, toggleCart } = useCart();
    const { theme, toggleTheme } = useTheme();
    const { registerCartIcon, isCartBumping } = useCartAnimation();
    const cartBtnRef = useRef(null);

    useEffect(() => {
        if (cartBtnRef.current) {
            registerCartIcon(cartBtnRef.current);
        }
    }, [registerCartIcon]);

    return (
        <header className="header glass">
            <div className="container header-content">
                <Link to="/" className="brand-logo">
                    <img src={logo} alt="Cantina João e Maria" />
                </Link>
                <nav className="nav-menu">
                    <button
                        onClick={toggleTheme}
                        className="nav-link theme-toggle"
                        title={theme === 'default' ? "Ativar Modo Claro" : "Ativar Modo Escuro"}
                        style={{ fontSize: '1.2rem', cursor: 'pointer' }}
                    >
                        {theme === 'default' ? '☀️' : '🌙'}
                    </button>
                    <Link to="/" className="nav-link">Home</Link>
                    <a href="#menu" className="nav-link">Menu</a>
                    <button
                        className={`cart-btn ${isCartBumping ? 'bump' : ''}`}
                        onClick={toggleCart}
                        ref={cartBtnRef}
                    >
                        🛒 Carrinho
                        {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                    </button>
                </nav>
            </div>
        </header>
    );
};

export default Header;
