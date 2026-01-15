# Script de prueba para Neologg Cloud API
Write-Host "`n======================================== " -ForegroundColor Cyan
Write-Host "  NEOLOGG CLOUD - API TEST" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$BackendHost = "localhost"
$BackendPort = "8094"
$BaseUrl = "http://${BackendHost}:${BackendPort}"
$AdminEmail = "superadmin@neologg.com"
$AdminPassword = "SuperAdmin123!"

# 1. Login
Write-Host "[1/6] Haciendo login como admin..." -ForegroundColor Yellow
$loginBody = @{ email = $AdminEmail; password = $AdminPassword } | ConvertTo-Json
try {
    $response = Invoke-WebRequest -Uri "$BaseUrl/unprotected/auth/login" -Method POST -Body $loginBody -ContentType "application/json" -SessionVariable session -UseBasicParsing
    Write-Host "OK Login exitoso" -ForegroundColor Green
} catch {
    Write-Host "ERROR en login: $_" -ForegroundColor Red
    exit 1
}

# 2. Verificar provisioning
Write-Host "`n[2/6] Consultando estado del provisioning..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$BaseUrl/api/admin/neologg/provisioning/status" -Method GET -WebSession $session -UseBasicParsing
    $data = ($response.Content | ConvertFrom-Json).data
    $status = if ($data.isEnabled) { "ACTIVO" } else { "DESACTIVADO" }
    Write-Host "OK Provisioning: $status" -ForegroundColor Green
    $isEnabled = $data.isEnabled
} catch {
    Write-Host "ERROR al consultar provisioning: $_" -ForegroundColor Red
    $isEnabled = $false
}

# 3. Activar provisioning si está desactivado
if (-not $isEnabled) {
    Write-Host "`n[3/6] Activando provisioning..." -ForegroundColor Yellow
    $body = @{ isEnabled = $true } | ConvertTo-Json
    try {
        $response = Invoke-WebRequest -Uri "$BaseUrl/api/admin/neologg/provisioning/toggle" -Method POST -Body $body -ContentType "application/json" -WebSession $session -UseBasicParsing
        Write-Host "OK Provisioning activado" -ForegroundColor Green
    } catch {
        Write-Host "ERROR al activar provisioning: $_" -ForegroundColor Red
    }
} else {
    Write-Host "`n[3/6] Provisioning ya estaba activo" -ForegroundColor Green
}

# 4. Provisionar un dispositivo
$testSN = "TEST$(Get-Random -Minimum 1000 -Maximum 9999)"
$testMAC = "AA:BB:CC:DD:EE:FF"
$testIMEI = "123456789012345"
Write-Host "`n[4/6] Provisionando dispositivo $testSN..." -ForegroundColor Yellow
$body = @{ serialNumber = $testSN; macAddress = $testMAC; imei = $testIMEI } | ConvertTo-Json
try {
    $response = Invoke-WebRequest -Uri "$BaseUrl/unprotected/neologg/provision" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
    $device = ($response.Content | ConvertFrom-Json).data
    Write-Host "OK Dispositivo provisionado exitosamente" -ForegroundColor Green
    Write-Host "   Licencia: $($device.license.Substring(0, 16))..." -ForegroundColor Gray
    Write-Host "   MQTT User: $($device.mqttUsername)" -ForegroundColor Gray
    $deviceId = $device.deviceId
} catch {
    Write-Host "ERROR al provisionar dispositivo: $_" -ForegroundColor Red
    $deviceId = $null
}

# 5. Listar dispositivos
Write-Host "`n[5/6] Listando dispositivos..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$BaseUrl/api/admin/neologg/devices" -Method GET -WebSession $session -UseBasicParsing
    $devices = ($response.Content | ConvertFrom-Json).data
    Write-Host "OK Total de dispositivos: $($devices.Count)" -ForegroundColor Green
    foreach ($device in $devices) {
        $lastSeen = if ($device.lastSeenAt) { $device.lastSeenAt } else { "N/A" }
        Write-Host "   $($device.serialNumber) - Estado: $($device.status.ToUpper()) - Ultimo: $lastSeen" -ForegroundColor Gray
    }
} catch {
    Write-Host "ERROR al listar dispositivos: $_" -ForegroundColor Red
}

# 6. Enviar acción al dispositivo
if ($deviceId) {
    Write-Host "`n[6/6] Enviando accion 'restart' al dispositivo..." -ForegroundColor Yellow
    $body = @{ action = "restart" } | ConvertTo-Json
    try {
        $response = Invoke-WebRequest -Uri "$BaseUrl/api/admin/neologg/devices/$deviceId/actions" -Method POST -Body $body -ContentType "application/json" -WebSession $session -UseBasicParsing
        Write-Host "OK Accion 'restart' enviada correctamente (publicado a MQTT)" -ForegroundColor Green
    } catch {
        Write-Host "ERROR al enviar accion: $_" -ForegroundColor Red
    }
}

Write-Host "`n======================================== " -ForegroundColor Green
Write-Host "  TESTS COMPLETADOS" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Green
Write-Host "Accede al dashboard en: http://localhost:5174/admin/dashboard" -ForegroundColor Cyan
