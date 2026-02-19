-- Execute este comando no SQL Editor do Supabase para adicionar a coluna de opções/sabores
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS options jsonb;

-- Comentário para documentar
COMMENT ON COLUMN products.options IS 'Lista de sabores ou variações do produto (ex: ["Uva", "Morango"])';
