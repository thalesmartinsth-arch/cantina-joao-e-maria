import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import OptionsModal from './OptionsModal';
import PartyOptionsModal from './PartyOptionsModal';
import '../styles/ProductCard.css';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const [showOptions, setShowOptions] = useState(false);
    const [showPartyOptions, setShowPartyOptions] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');

    const handleAddToCart = () => {
        if (product.weeklyMenu) {
            setShowOptions(true);
        } else if (product.partyKit) {
            setShowPartyOptions(true);
        } else if (product.options && product.options.length > 0) {
            if (!selectedOption) {
                alert('Por favor, selecione um sabor/opção.');
                return;
            }
            const customProduct = {
                ...product,
                id: `${product.id}-${selectedOption}`,
                name: `${product.name} (${selectedOption})`,
                selectedOption: selectedOption
            };
            addToCart(customProduct);
            setSelectedOption(''); // Reset after adding
        } else {
            addToCart(product);
        }
    };

    const handleConfirmOptions = (selectedDays) => {
        const customProduct = {
            ...product,
            id: `${product.id}-${selectedDays.join('-')}`, // Unique ID
            name: `${product.name} (${selectedDays.length} dias)`,
            selectedDays: selectedDays,
            price: product.price * selectedDays.length,
            description: `Dias: ${selectedDays.join(', ')}`
        };

        addToCart(customProduct);
        setShowOptions(false);
    };

    const handleConfirmParty = (selectedSnacks) => {
        const customProduct = {
            ...product,
            id: `${product.id}-festa-${Date.now()}`, // Unique ID for every custom kit
            selectedSnacks: selectedSnacks,
            description: `Salgados: ${selectedSnacks.join(', ')}`
        };

        addToCart(customProduct);
        setShowPartyOptions(false);
    };

    return (
        <>
            <div className="product-card glass">
                <div className="product-image-container">
                    <img
                        src={product.image_type === 'local' ? `/images/${product.image}` : product.image}
                        alt={product.name}
                        className="product-image"
                        onError={(e) => { e.target.onerror = null; e.target.src = '/images/placeholder.png'; }} // Fallback if needed
                    />
                    <span className="product-category">{product.category}</span>
                </div>
                <div className="product-content">
                    <div className="product-header">
                        <h3 className="product-title">{product.name}</h3>
                        <span className="product-price">R$ {product.price.toFixed(2)}</span>
                    </div>
                    <p className="product-description">{product.description}</p>

                    {product.options && product.options.length > 0 && (
                        <div className="product-options">
                            <select
                                value={selectedOption}
                                onChange={(e) => setSelectedOption(e.target.value)}
                                className="option-select"
                            >
                                <option value="">Selecione o sabor...</option>
                                {product.options.map((opt, index) => (
                                    <option key={index} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <button
                        className="btn btn-primary add-to-cart-btn"
                        onClick={handleAddToCart}
                    >
                        Adicionar
                    </button>
                </div>
            </div>
            {showOptions && (
                <OptionsModal
                    product={product}
                    onClose={() => setShowOptions(false)}
                    onConfirm={handleConfirmOptions}
                />
            )}
            {showPartyOptions && (
                <PartyOptionsModal
                    product={product}
                    onClose={() => setShowPartyOptions(false)}
                    onConfirm={handleConfirmParty}
                />
            )}
        </>
    );
};

export default ProductCard;
