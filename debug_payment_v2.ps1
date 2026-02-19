$json = Get-Content .\temp_payload.json -Raw
try {
    $response = Invoke-RestMethod -Uri 'https://uoxloggzlndamvekiany.supabase.co/functions/v1/create-payment' -Method Post -Headers @{ 'Authorization' = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVveGxvZ2d6bG5kYW12ZWtpYW55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0MTkyMTcsImV4cCI6MjA4Njk5NTIxN30.gdQedYeq9uDSpwz4WBxjV4TODx4oxQwyV2OvCQ18K3Y'; 'Content-Type' = 'application/json' } -Body $json
    $result = "Success:`n" + ($response | ConvertTo-Json -Depth 10)
    $result | Set-Content -Path .\debug_result.txt
}
catch {
    $err = "Error Status: " + $_.Exception.Response.StatusCode.value__ + "`n"
    if ($_.Exception.Response) {
        $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
        $body = $reader.ReadToEnd()
        $err += "Response Body: " + $body
    }
    $err | Set-Content -Path .\debug_result.txt
}
