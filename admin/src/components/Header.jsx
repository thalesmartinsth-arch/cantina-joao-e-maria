import React from 'react';
import { LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Header.css';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    return (
        <header className="header glass">
            <div className="container header-content">
                <div className="brand-actions-wrapper">
                    <div className="brand">
                        <div className="brand-logo">
                            <img src="/images/logo.png" alt="Logo Lanchonete" />
                        </div>
                        <div className="brand-text">
                            <h1>Cantina <span className="text-gradient">João e Maria</span></h1>
                            <p className="badge-admin">SISTEMA ADMINISTRATIVO</p>
                        </div>
                    </div>

                    <nav className="header-nav">
                        <button
                            className={`btn nav-btn ${location.pathname === '/dashboard' ? 'active' : ''}`}
                            onClick={() => navigate('/dashboard')}
                        >
                            📦 Produtos
                        </button>
                        <button
                            className={`btn nav-btn ${location.pathname === '/orders' ? 'active' : ''}`}
                            onClick={() => navigate('/orders')}
                        >
                            📋 Pedidos
                        </button>
                        <button
                            className={`btn nav-btn ${location.pathname === '/financial' ? 'active' : ''}`}
                            onClick={() => navigate('/financial')}
                        >
                            💰 Financeiro
                        </button>
                        <button
                            className={`btn nav-btn ${location.pathname === '/history' ? 'active' : ''}`}
                            onClick={() => navigate('/history')}
                        >
                            📜 Histórico
                        </button>
                    </nav>

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
