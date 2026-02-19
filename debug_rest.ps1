try {
    $response = Invoke-RestMethod -Uri 'https://uoxloggzlndamvekiany.supabase.co/rest/v1/products?select=count(*)' -Method Get -Headers @{ 'apikey' = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVveGxvZ2d6bG5kYW12ZWtpYW55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0MTkyMTcsImV4cCI6MjA4Njk5NTIxN30.gdQedYeq9uDSpwz4WBxjV4TODx4oxQwyV2OvCQ18K3Y'; 'Authorization' = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVveGxvZ2d6bG5kYW12ZWtpYW55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0MTkyMTcsImV4cCI6MjA4Njk5NTIxN30.gdQedYeq9uDSpwz4WBxjV4TODx4oxQwyV2OvCQ18K3Y' }
    Write-Host "REST API Success:"
    $response | ConvertTo-Json
}
catch {
    Write-Host "REST API Fail: " $_.Exception.Message
}
