@echo off
echo Configurando Segredo no Supabase...
cd /d "c:\Users\thales.martins\Documents\Antigravity\Lanchonete"
call npx supabase link --project-ref uoxloggzlndamvekiany
call npx supabase secrets set MP_ACCESS_TOKEN=APP_USR-3166270596993130-021814-bd9388fe8be6bd72d561aa3e02c1ba04-301420609
echo.
echo Segredo Configurado! Tente gerar o PIX agora.
pause
