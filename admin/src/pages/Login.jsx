
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [isResetMode, setIsResetMode] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            navigate('/dashboard');
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            // Using current origin for the redirect URL in production/local
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (error) throw error;

            setMessage('Enviamos um email com um link para redefinir sua senha.');
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>{isResetMode ? 'Recuperar Senha' : 'Admin Login'}</h2>

                {message && <div className="success-message">{message}</div>}

                <form onSubmit={isResetMode ? handleResetPassword : handleLogin}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    {!isResetMode && (
                        <div className="form-group">
                            <label>Senha</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    )}

                    {error && <p className="error-message">{error}</p>}

                    <button type="submit" disabled={loading}>
                        {loading
                            ? 'Aguarde...'
                            : isResetMode
                                ? 'Enviar link de recuperação'
                                : 'Entrar'
                        }
                    </button>

                    <div className="login-footer">
                        <button
                            type="button"
                            className="text-btn"
                            onClick={() => {
                                setIsResetMode(!isResetMode);
                                setError(null);
                                setMessage(null);
                            }}
                        >
                            {isResetMode ? 'Voltar para o Login' : 'Esqueceu a senha?'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
