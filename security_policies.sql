-- 1. Habilitar RLS nas tabelas (Bloqueia acesso público por padrão)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- 2. Políticas para Produtos (Quem pode ver/editar?)
-- Todos (público) podem VER os produtos
CREATE POLICY "Public Products Access" 
ON products FOR SELECT 
USING (true);

-- Apenas Admin (autenticado) pode CRIAR, EDITAR ou DELETAR produtos
CREATE POLICY "Admin Products Modify" 
ON products FOR ALL 
USING (auth.role() = 'authenticated');

-- 3. Políticas para Pedidos (Quem pode ver/editar?)
-- Qualquer um (público/anonimo) pode CRIAR um pedido (fazer uma compra)
CREATE POLICY "Enable insert for everyone" 
ON orders FOR INSERT 
WITH CHECK (true);

-- Apenas Admin (autenticado) pode VER os pedidos (dashboards)
CREATE POLICY "Enable select for authenticated users only" 
ON orders FOR SELECT 
USING (auth.role() = 'authenticated');

-- Apenas Admin (autenticado) pode ATUALIZAR pedidos (mudar status para 'entregue')
CREATE POLICY "Enable update for authenticated users only" 
ON orders FOR UPDATE 
USING (auth.role() = 'authenticated');
