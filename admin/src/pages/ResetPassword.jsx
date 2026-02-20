import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import './ResetPassword.css';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Automatically listen for hash fragment to process the token.
        // Supabase client handles grabbing the access_token from the URL.
        const checkHash = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (!session && !window.location.hash.includes('access_token')) {
                setError("Link de redefinição inválido ou expirado. Por favor, solicite um novo na tela de login.");
            }
        };
        checkHash();
    }, []);

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (password !== confirmPassword) {
            setError("As senhas não coincidem.");
            setLoading(false);
            return;
        }

        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) throw error;

            setSuccess(true);
            setTimeout(() => {
                navigate('/dashboard');
            }, 3000); // Redirect after 3 seconds
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="reset-container">
                <div className="reset-card">
                    <h2>Senha Atualizada!</h2>
                    <div className="success-message">
                        Sua senha foi redefinida com sucesso. Redirecionando para o painel...
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="reset-container">
            <div className="reset-card">
                <h2>Definir Nova Senha</h2>
                <form onSubmit={handleUpdatePassword}>
                    <div className="form-group">
                        <label>Nova Senha</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                    </div>
                    <div className="form-group">
                        <label>Confirmar Nova Senha</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                    </div>

                    {error && <p className="error-message">{error}</p>}

                    <button type="submit" disabled={loading || !!error}>
                        {loading ? 'Salvando...' : 'Salvar Nova Senha'}
                    </button>

                    <div className="reset-footer">
                        <button
                            type="button"
                            className="text-btn"
                            onClick={() => navigate('/login')}
                        >
                            Voltar para o Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
