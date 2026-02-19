import React, { useState } from 'react';
import '../styles/Modals.css';

const OptionsModal = ({ product, onClose, onConfirm }) => {
    const [selectedDays, setSelectedDays] = useState([]);

    const toggleDay = (day) => {
        setSelectedDays(prev =>
            prev.includes(day)
                ? prev.filter(d => d !== day)
                : [...prev, day]
        );
    };

    const handleConfirm = () => {
        if (selectedDays.length === 0) return;
        onConfirm(selectedDays);
    };

    const totalPrice = product.price * selectedDays.length;

    return (
        <div className="modal-overlay" onClick={(e) => {
            if (e.target.className === 'modal-overlay') onClose();
        }}>
            <div className="modal-content">
                <button className="modal-close-btn" onClick={onClose}>&times;</button>
                <h2>Selecione os Dias</h2>

                <p style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                    Escolha os dias da semana para: <strong>{product.name}</strong>
                </p>

                <div className="days-selection">
                    {product.weekly_menu.map((option) => (
                        <div
                            key={option.day}
                            className={`modal-option ${selectedDays.includes(option.day) ? 'selected' : ''}`}
                            onClick={() => toggleDay(option.day)}
                        >
                            <span>
                                <strong style={{ color: 'var(--color-primary)' }}>{option.day}:</strong>
                                <br />
                                <span style={{ fontSize: '0.9em', color: 'var(--color-text)' }}>
                                    🍴 {option.item}
                                    {option.beverage && <><br />🥤 {option.beverage}</>}
                                    {option.fruit && <><br />🍎 {option.fruit}</>}
                                </span>
                            </span>
                            <input
                                type="checkbox"
                                checked={selectedDays.includes(option.day)}
                                readOnly
                                style={{ width: '20px', height: '20px', accentColor: 'var(--color-primary)' }}
                            />
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: '20px', padding: '10px', background: 'rgba(0,0,0,0.05)', borderRadius: '8px' }}>
                    <p style={{ marginBottom: '5px' }}>Dias selecionados: <strong>{selectedDays.length}</strong></p>
                    <p>Total: <strong style={{ color: 'var(--color-primary)', fontSize: '1.2em' }}>R$ {totalPrice.toFixed(2)}</strong></p>
                </div>

                <div className="modal-actions">
                    <button
                        className="btn btn-primary"
                        onClick={handleConfirm}
                        disabled={selectedDays.length === 0}
                        style={{ width: '100%', opacity: selectedDays.length === 0 ? 0.5 : 1 }}
                    >
                        Adicionar ao Carrinho
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OptionsModal;
