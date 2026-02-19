
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase Environment Variables!');
    // Emergency Error Display for Deployment Debugging
    if (typeof window !== 'undefined') {
        document.body.innerHTML = `
            <div style="background: black; color: red; padding: 20px; font-family: sans-serif; height: 100vh;">
                <h1>⚠️ Erro Crítico de Configuração</h1>
                <p>As variáveis de ambiente do Supabase não foram encontradas.</p>
                <hr style="border: 1px solid #333"/>
                <p><strong>Verifique na Vercel:</strong> Settings > Environment Variables</p>
                <p>O site precisa de: <code>VITE_SUPABASE_URL</code> e <code>VITE_SUPABASE_ANON_KEY</code></p>
            </div>
        `;
    }
    throw new Error('Missing Supabase Environment Variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
