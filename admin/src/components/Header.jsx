import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Header.css';

const Header = () => {
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    const getButtonStyle = (path) => {
        const isActive = location.pathname === path;
        return isActive
            ? { background: 'var(--color-primary)', color: 'white', border: '1px solid var(--color-primary)' }
            : { background: 'transparent', color: 'var(--color-text)', border: '1px solid var(--border-color)' };
    };

    return (
        <header className="header glass">
            <div className="container header-content">
                <div className="brand">
                    <div className="brand-logo">
                        <img src="/images/logo.png" alt="Logo Lanchonete" />
                    </div>
                    <div className="brand-text">
                        <h1>Cantina <span className="text-gradient">João e Maria</span></h1>
                        <p className="badge-admin">SISTEMA ADMINISTRATIVO</p>
                    </div>
                </div>

                <nav style={{ display: 'flex', gap: '1rem', marginRight: 'auto', marginLeft: '2rem' }}>
                    <button
                        className="btn"
                        style={getButtonStyle('/dashboard')}
                        onClick={() => navigate('/dashboard')}
                    >
                        📦 Produtos
                    </button>
                    <button
                        className="btn"
                        style={getButtonStyle('/orders')}
                        onClick={() => navigate('/orders')}
                    >
                        📋 Pedidos
                    </button>
                    <button
                        className="btn"
                        style={getButtonStyle('/financial')}
                        onClick={() => navigate('/financial')}
                    >
                        💰 Financeiro
                    </button>
                    <button
                        className="btn"
                        style={getButtonStyle('/history')}
                        onClick={() => navigate('/history')}
                    >
                        📜 Histórico
                    </button>
                </nav>

                <div className="header-actions">
                    <button className="theme-toggle" onClick={toggleTheme} aria-label="Alterar tema">
                        {theme === 'default' ? <Sun size={24} /> : <Moon size={24} />}
                    </button>

                    <button className="btn btn-logout" onClick={handleLogout}>
                        <LogOut size={20} />
                        <span>Sair</span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
