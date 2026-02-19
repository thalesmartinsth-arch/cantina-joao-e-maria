import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import { supabase } from '../supabaseClient';
import '../styles/Home.css';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [activeCategory, setActiveCategory] = useState("Todos");
    const [loading, setLoading] = useState(true);

    const categories = ["Todos", "Salgados", "Bebidas", "Doces", "Lanche Bem", "Festas"];

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

    const filteredProducts = activeCategory === "Todos"
        ? products
        : products.filter(p => p.category === activeCategory);

    if (loading) {
        return <div className="loading-screen">Carregando delícias...</div>;
    }

    return (
        <>
            <Header />
            <main>
                <section className="hero-section">
                    <div className="hero-content">
                        <h1>Delícias da <span className="text-gradient">João e Maria</span></h1>
                        <p>O melhor lanche da escola, feito com muito carinho e sabor para você!</p>
                        <a href="#menu" className="cta-button">Ver Cardápio</a>
                    </div>
                    <div className="hero-background-glow"></div>
                </section>

                <section id="menu" className="menu-section container">
                    <h2 className="section-title">Nosso Menu</h2>

                    <div className="category-filter">
                        {categories.map(category => (
                            <button
                                key={category}
                                className={`category-btn ${activeCategory === category ? 'active' : ''}`}
                                onClick={() => setActiveCategory(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    <div className="product-grid">
                        {filteredProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </section>
            </main>

            <footer className="footer container">
                <p>&copy; 2026 Lanchonete Innovation. Todos os direitos reservados. <br /><small>v1.1 (PIX Fix)</small></p>
            </footer>
        </>
    );
};

export default Home;
