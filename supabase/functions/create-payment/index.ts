import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS preflight request
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { items, payer } = await req.json()
        const accessToken = Deno.env.get('MP_ACCESS_TOKEN')

        if (!accessToken) {
            throw new Error('Missing MP_ACCESS_TOKEN')
        }

        // Calculate total securely on the server
        const total_amount = items.reduce((sum: any, item: any) => sum + (item.price * item.quantity), 0)

        const description = `Pedido Lanchonete - ${payer.name}`

        // Create Payment in Mercado Pago (v1/payments)
        const mpResponse = await fetch('https://api.mercadopago.com/v1/payments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'X-Idempotency-Key': crypto.randomUUID()
            },
            body: JSON.stringify({
                transaction_amount: Number(total_amount.toFixed(2)),
                description: description,
                payment_method_id: "pix",
                payer: {
                    email: payer.email,
                    first_name: payer.name.split(" ")[0],
                    last_name: payer.name.split(" ").slice(1).join(" ") || "Cliente",
                    identification: {
                        type: "CPF",
                        number: "19119119100" // CPF is required for PIX
                    }
                }
            })
        })

        const mpData = await mpResponse.json()

        if (!mpResponse.ok) {
            console.error('MP Error:', mpData)
            throw new Error(mpData.message || 'Failed to create payment')
        }

        // Return the Payment Data (ID and QR Code)
        return new Response(
            JSON.stringify({
                id: mpData.id,
                status: mpData.status,
                point_of_interaction: mpData.point_of_interaction,
                initPoint: null // Not used for direct PIX
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
