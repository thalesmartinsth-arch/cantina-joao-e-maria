import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { CartAnimationProvider } from './context/CartAnimationContext';
import CartSidebar from './components/CartSidebar';
import CheckoutModal from './components/CheckoutModal';
import Home from './pages/Home';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <CartAnimationProvider>
        <CartProvider>
          <BrowserRouter>
            <CartSidebar />
            <CheckoutModal />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="*" element={
                <div style={{ textAlign: 'center', padding: '50px', color: 'var(--color-text)' }}>
                  <h1>Página não encontrada 😕</h1>
                  <p>Parece que você tentou acessar uma página que não existe na área do cliente.</p>
                  <Link to="/" style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>Voltar para o Início</Link>
                </div>
              } />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </CartAnimationProvider>
    </ThemeProvider>
  );
  /*
    return (
      <ThemeProvider>
        <CartProvider>
          <BrowserRouter>
            <CartSidebar />
            <CheckoutModal />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="*" element={
                  <div style={{ textAlign: 'center', padding: '50px', color: 'var(--color-text)' }}>
                      <h1>Página não encontrada 😕</h1>
                      <p>Parece que você tentou acessar uma página que não existe na área do cliente.</p>
                      <Link to="/" style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>Voltar para o Início</Link>
                  </div>
              } />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </ThemeProvider>
    );
  */
}

export default App;
