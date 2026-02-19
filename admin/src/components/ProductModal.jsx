import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { supabase } from '../supabaseClient';
import './ProductModal.css';

const ProductModal = ({ product, isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: 'Salgados',
        description: '',
        image: '',
        image_type: 'url',
        options: []
    });

    const [newOption, setNewOption] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (product) {
            setFormData({
                ...product,
                options: product.options || []
            });
        } else {
            setFormData({
                name: '',
                price: '',
                category: 'Salgados',
                description: '',
                image: '',
                image_type: 'url',
                options: []
            });
        }
    }, [product, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddOption = (e) => {
        e.preventDefault();
        if (newOption.trim()) {
            setFormData(prev => ({
                ...prev,
                options: [...prev.options, newOption.trim()]
            }));
            setNewOption('');
        }
    };

    const handleRemoveOption = (index) => {
        setFormData(prev => ({
            ...prev,
            options: prev.options.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const productData = {
                name: formData.name,
                price: parseFloat(formData.price),
                category: formData.category,
                description: formData.description,
                image: formData.image,
                image_type: formData.image_type,
                options: formData.options.length > 0 ? formData.options : null
            };

            let error;
            if (product?.id) {
                // Update
                const { error: updateError } = await supabase
                    .from('products')
                    .update(productData)
                    .eq('id', product.id);
                error = updateError;
            } else {
                // Create
                const { error: insertError } = await supabase
                    .from('products')
                    .insert([productData]);
                error = insertError;
            }

            if (error) throw error;
            onSave();
            onClose();
        } catch (error) {
            console.error('Erro ao salvar:', error);
            alert('Erro ao salvar produto: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content glass">
                <div className="modal-header">
                    <h2>{product ? 'Editar Produto' : 'Novo Produto'}</h2>
                    <button className="close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="product-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label>Nome</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Preço (R$)</label>
                            <input
                                type="number"
                                name="price"
                                step="0.01"
                                value={formData.price}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Categoria</label>
                        <select name="category" value={formData.category} onChange={handleChange}>
                            <option value="Salgados">Salgados</option>
                            <option value="Bebidas">Bebidas</option>
                            <option value="Doces">Doces</option>
                            <option value="Lanche Bem">Lanche Bem</option>
                            <option value="Festas">Festas</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Descrição</label>
                        <textarea
                            name="description"
                            value={formData.description || ''}
                            onChange={handleChange}
                            rows="3"
                        />
                    </div>

                    <div className="form-group">
                        <label>Imagem (URL ou Nome do Arquivo Local)</label>
                        <input
                            type="text"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                        />
                        <div className="image-type-toggle">
                            <label>
                                <input
                                    type="radio"
                                    name="image_type"
                                    value="url"
                                    checked={formData.image_type === 'url'}
                                    onChange={handleChange}
                                /> URL
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="image_type"
                                    value="local"
                                    checked={formData.image_type === 'local'}
                                    onChange={handleChange}
                                /> Local (/images/...)
                            </label>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Sabores / Opções</label>
                        <div className="options-input">
                            <input
                                type="text"
                                value={newOption}
                                onChange={(e) => setNewOption(e.target.value)}
                                placeholder="Digite uma opção e aperte Enter"
                                onKeyDown={(e) => e.key === 'Enter' && handleAddOption(e)}
                            />
                            <button type="button" onClick={handleAddOption} className="add-option-btn">
                                <Plus size={20} />
                            </button>
                        </div>

                        <div className="options-list">
                            {formData.options.map((opt, index) => (
                                <span key={index} className="option-tag">
                                    {opt}
                                    <button type="button" onClick={() => handleRemoveOption(index)}>
                                        <X size={14} />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
                        <button type="submit" className="btn-save" disabled={loading}>
                            {loading ? 'Salvando...' : 'Salvar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductModal;
