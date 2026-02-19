import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

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
        const { payment_id } = await req.json()
        const accessToken = Deno.env.get('MP_ACCESS_TOKEN')

        if (!accessToken) throw new Error('Missing MP_ACCESS_TOKEN')
        if (!payment_id) throw new Error('Missing payment_id')

        const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${payment_id}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })

        if (!mpResponse.ok) {
            throw new Error('Failed to fetch payment status')
        }

        const mpData = await mpResponse.json()

        return new Response(
            JSON.stringify({
                status: mpData.status,
                status_detail: mpData.status_detail
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        )

    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
    }
})
