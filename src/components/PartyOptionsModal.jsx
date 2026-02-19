import React, { useState } from 'react';
import '../styles/Modals.css';

const PartyOptionsModal = ({ product, onClose, onConfirm }) => {
    const { totalSnacks, snackOptions } = product.partyKit;

    const [selections, setSelections] = useState(
        snackOptions.reduce((acc, option) => ({ ...acc, [option]: 0 }), {})
    );

    const currentTotal = Object.values(selections).reduce((a, b) => a + b, 0);
    const remaining = totalSnacks - currentTotal;

    const handleIncrement = (option) => {
        if (currentTotal + 10 <= totalSnacks) {
            setSelections(prev => ({
                ...prev,
                [option]: prev[option] + 10
            }));
        }
    };

    const handleDecrement = (option) => {
        if (selections[option] >= 10) {
            setSelections(prev => ({
                ...prev,
                [option]: prev[option] - 10
            }));
        }
    };

    const handleConfirm = () => {
        const selectedList = Object.entries(selections)
            .filter(([_, qty]) => qty > 0)
            .map(([name, qty]) => `${qty}x ${name}`);

        onConfirm(selectedList);
    };

    const isComplete = currentTotal === totalSnacks;

    return (
        <div className="modal-overlay" onClick={(e) => {
            if (e.target.className === 'modal-overlay') onClose();
        }}>
            <div className="modal-content" style={{ maxWidth: '600px' }}>
                <button className="modal-close-btn" onClick={onClose}>&times;</button>
                <h2>Monte o Kit Festa</h2>

                <p style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                    Escolha os salgados para: <strong>{product.name}</strong>
                </p>

                <div style={{
                    background: 'var(--color-bg-secondary)',
                    padding: '15px',
                    borderRadius: '8px',
                    marginBottom: '15px',
                    textAlign: 'center',
                    border: isComplete ? '1px solid var(--color-primary)' : '1px solid rgba(128,128,128, 0.3)'
                }}>
                    <span style={{ fontSize: '1.2em', fontWeight: 'bold', color: isComplete ? 'var(--color-primary)' : 'var(--color-text)' }}>
                        Selecionados: {currentTotal} / {totalSnacks}
                    </span>
                    {!isComplete && (
                        <p style={{ fontSize: '0.9em', color: 'var(--color-text-muted)', margin: '5px 0 0' }}>
                            Faltam: {remaining} salgados
                        </p>
                    )}
                </div>

                <div style={{
                    maxHeight: '300px',
                    overflowY: 'auto',
                    paddingRight: '5px'
                }}>
                    {snackOptions.map((option) => (
                        <div key={option}
                            className="modal-option"
                            style={{ cursor: 'default' }}
                        >
                            <span style={{ flex: 1, color: 'var(--color-text)' }}>{option}</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <button
                                    onClick={() => handleDecrement(option)}
                                    disabled={selections[option] === 0}
                                    style={{
                                        padding: '5px 10px',
                                        background: 'rgba(128, 128, 128, 0.2)',
                                        border: 'none',
                                        color: 'var(--color-text)',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        opacity: selections[option] === 0 ? 0.3 : 1
                                    }}
                                >
                                    -10
                                </button>
                                <span style={{ minWidth: '30px', textAlign: 'center', fontWeight: 'bold', color: 'var(--color-text)' }}>
                                    {selections[option]}
                                </span>
                                <button
                                    onClick={() => handleIncrement(option)}
                                    disabled={currentTotal >= totalSnacks}
                                    style={{
                                        padding: '5px 10px',
                                        background: 'var(--color-primary)',
                                        border: 'none',
                                        color: 'white',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        opacity: currentTotal >= totalSnacks ? 0.3 : 1
                                    }}
                                >
                                    +10
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="modal-actions">
                    <button
                        onClick={handleConfirm}
                        className="btn btn-primary"
                        disabled={!isComplete}
                        style={{ width: '100%', opacity: !isComplete ? 0.5 : 1 }}
                    >
                        {isComplete ? 'Confirmar Salgados' : `Escolha mais ${remaining} unidades`}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PartyOptionsModal;
