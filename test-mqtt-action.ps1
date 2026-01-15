# Test MQTT Device Action
# Prueba envío de acción a un dispositivo

$baseUrl = "http://localhost:8094"

# 1. Login como admin
Write-Host "=== 1. LOGIN ===" -ForegroundColor Cyan
$loginBody = @{
    email = "superadmin@neologg.com"
    password = "SuperAdmin123!"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "$baseUrl/unprotected/auth/login" `
    -Method POST `
    -Headers @{"Content-Type"="application/json"} `
    -Body $loginBody

$token = $loginResponse.data.token
Write-Host "Token obtenido: $($token.Substring(0, 20))..." -ForegroundColor Green

# 2. Obtener lista de dispositivos
Write-Host "`n=== 2. GET DEVICE LIST ===" -ForegroundColor Cyan
$devicesResponse = Invoke-RestMethod -Uri "$baseUrl/api/admin/neologg/devices" `
    -Method GET `
    -Headers @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }

if ($devicesResponse.data.Count -eq 0) {
    Write-Host "No hay dispositivos" -ForegroundColor Yellow
    exit
}

$device = $devicesResponse.data[0]
Write-Host "Dispositivo: $($device.serialNumber) (ID: $($device.deviceId))" -ForegroundColor Green

# 3. Enviar acción
Write-Host "`n=== 3. SEND ACTION ===" -ForegroundColor Cyan
$actionBody = @{
    action = "restart"
} | ConvertTo-Json

try {
    $actionResponse = Invoke-RestMethod -Uri "$baseUrl/api/admin/neologg/devices/$($device.deviceId)/actions" `
        -Method POST `
        -Headers @{
            "Authorization" = "Bearer $token"
            "Content-Type" = "application/json"
        } `
        -Body $actionBody
    
    Write-Host "Acción enviada exitosamente:" -ForegroundColor Green
    Write-Host ($actionResponse | ConvertTo-Json -Depth 5) -ForegroundColor White
} catch {
    Write-Host "Error al enviar acción:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host $_.ErrorDetails.Message -ForegroundColor Yellow
    }
}
