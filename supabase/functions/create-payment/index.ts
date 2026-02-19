import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        // 1. Setup Supabase Client
        const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
        const supabase = createClient(supabaseUrl, supabaseKey)

        // 2. Parse Request
        const { items, payer } = await req.json()
        const accessToken = (Deno.env.get('MP_ACCESS_TOKEN') || '').trim();

        if (!accessToken) {
            throw new Error('Missing MP_ACCESS_TOKEN variable in Supabase Secrets');
        }

        // 3. Validate Prices (Security Hardening)
        const { data: dbProducts, error: dbError } = await supabase
            .from('products')
            .select('id, price, name, category')

        if (dbError) throw dbError;

        const productMap = new Map(dbProducts.map(p => [String(p.id), p]));
        const simpleCategories = ["Salgados", "Bebidas", "Doces"];

        const calculatedTotal = items.reduce((sum: number, item: any) => {
            // ID format might be "1" or "1-Chocolate"
            const baseId = String(item.id).split('-')[0];
            const dbProduct = productMap.get(baseId);

            let finalPrice = item.price; // Default to client price (only for complex items)

            if (dbProduct) {
                // SECURITY: For standard categories, ALWAYS use the DB price.
                if (simpleCategories.includes(dbProduct.category)) {
                    if (finalPrice !== dbProduct.price) {
                        console.warn(`Price mismatch for ${dbProduct.name}. Client: ${finalPrice}, DB: ${dbProduct.price}. Enforcing DB price.`);
                        finalPrice = dbProduct.price;
                    }
                }
                // For "Lanche Bem" and "Festas", price depends on days/quantity logic 
                // that is complex to replicate here without duplicating logic.
                // We trust the client for these specific categories for MVP.
            }

            return sum + (finalPrice * item.quantity);
        }, 0);

        // 4. Create Mercado Pago Payment
        const description = `Pedido Lanchonete - ${payer.name} - ${payer.email}`

        const mpResponse = await fetch('https://api.mercadopago.com/v1/payments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'X-Idempotency-Key': crypto.randomUUID()
            },
            body: JSON.stringify({
                transaction_amount: Number(calculatedTotal.toFixed(2)),
                description: description,
                payment_method_id: "pix",
                payer: {
                    email: payer.email,
                    first_name: payer.name.split(" ")[0],
                    last_name: payer.name.split(" ").slice(1).join(" ") || "Cliente",
                    identification: {
                        type: "CPF",
                        number: "19119119100"
                    }
                }
            })
        })

        const mpData = await mpResponse.json()

        if (!mpResponse.ok) {
            console.error('MP Error:', mpData)
            throw new Error(mpData.message || 'Failed to create payment')
        }

        // 5. Return Success
        return new Response(
            JSON.stringify({
                id: mpData.id,
                status: mpData.status,
                qr_code: mpData.point_of_interaction?.transaction_data?.qr_code,
                qr_code_base64: mpData.point_of_interaction?.transaction_data?.qr_code_base64
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        )

    } catch (error) {
        console.error(error)
        return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
    }
})
