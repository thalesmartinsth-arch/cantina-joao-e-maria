
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { productsSeed } from '../utils/seedData';
import { LogOut, Plus, Package, Upload } from 'lucide-react';
import Header from '../components/Header';
import ProductModal from '../components/ProductModal';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [importing, setImporting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('id', { ascending: true });

            if (error) throw error;
            setProducts(data);
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleNewProduct = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const handleDeleteProduct = async (id) => {
        if (!window.confirm('Tem certeza que deseja excluir este produto?')) return;

        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchProducts();
        } catch (error) {
            console.error('Erro ao excluir:', error);
            alert('Erro ao excluir produto.');
        }
    };

    const handleImportProducts = async () => {
        if (!window.confirm('Tem certeza que deseja importar os produtos padrão? Isso pode duplicar itens se já existirem.')) return;

        setImporting(true);
        console.log('User:', (await supabase.auth.getUser()).data.user);
        try {
            const { error } = await supabase
                .from('products')
                .insert(productsSeed);

            if (error) throw error;

            alert('Produtos importados com sucesso!');
            fetchProducts();
        } catch (error) {
            console.error('Erro ao importar:', error);
            alert(`Erro ao importar produtos:\n${error.message}\n${error.details || ''}\n${error.hint || ''}`);
        } finally {
            setImporting(false);
        }
    };

    return (
        <div className="dashboard-container">
            <Header />

            <ProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                product={editingProduct}
                onSave={fetchProducts}
            />

            <main className="dashboard-main">
                <div className="actions-bar">
                    <h2>Produtos ({products.length})</h2>
                    <div className="action-buttons">

                        <button className="add-btn" onClick={handleNewProduct}>
                            <Plus size={18} /> Novo Produto
                        </button>
                    </div>
                </div>

                {loading ? (
                    <p>Carregando...</p>
                ) : (
                    <div className="products-grid">
                        {products.length === 0 ? (
                            <div className="empty-state">
                                <Package size={48} />
                                <p>Nenhum produto cadastrado.</p>
                                <p>Use o botão de importar para começar.</p>
                            </div>
                        ) : (
                            products.map((product) => (
                                <div key={product.id} className="product-card-admin glass">
                                    <div className="product-image">
                                        <img
                                            src={product.image_type === 'local' ? `/images/${product.image}` : product.image}
                                            alt={product.name}
                                            onError={(e) => { e.target.onerror = null; e.target.src = '/images/placeholder.png'; }}
                                        />
                                    </div>
                                    <div className="product-info">
                                        <h3>{product.name}</h3>
                                        <p className="price">R$ {product.price.toFixed(2)}</p>
                                        <span className="category-tag">{product.category}</span>
                                        {product.options && product.options.length > 0 && (
                                            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
                                                {product.options.length} opções disponíveis
                                            </div>
                                        )}
                                    </div>
                                    <div className="product-actions" style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                                        <button className="btn" onClick={() => handleEditProduct(product)}>Editar</button>
                                        <button className="btn" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }} onClick={() => handleDeleteProduct(product.id)}>Excluir</button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
