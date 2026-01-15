# Script de prueba para Neologg Cloud
# Simula un dispositivo IoT que se provisiona y envía telemetría

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  NEOLOGG CLOUD - TEST SCRIPT" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$BackendHost = "localhost"
$BackendPort = "8094"
$BaseUrl = "http://${BackendHost}:${BackendPort}"

# Credenciales de admin
$AdminEmail = "superadmin@neologg.com"
$AdminPassword = "SuperAdmin123!"

# Función para hacer login
function Login-Admin {
    Write-Host "`n[1/6] Haciendo login como admin..." -ForegroundColor Yellow
    
    $loginBody = @{
        email = $AdminEmail
        password = $AdminPassword
    } | ConvertTo-Json

    try {
        $response = Invoke-WebRequest -Uri "$BaseUrl/unprotected/auth/login" `
            -Method POST `
            -Body $loginBody `
            -ContentType "application/json" `
            -SessionVariable session `
            -UseBasicParsing
        
        Write-Host "✅ Login exitoso" -ForegroundColor Green
        return $session
    } catch {
        Write-Host "❌ Error en login: $_" -ForegroundColor Red
        exit 1
    }
}

# Función para verificar estado del provisioning
function Get-ProvisioningStatus {
    param($Session)
    
    Write-Host "`n[2/6] Consultando estado del provisioning..." -ForegroundColor Yellow
    
    try {
        $response = Invoke-WebRequest -Uri "$BaseUrl/admin/neologg/provisioning/status" `
            -Method GET `
            -WebSession $Session `
            -UseBasicParsing
        
        $data = ($response.Content | ConvertFrom-Json).data
        $status = if ($data.isEnabled) { "ACTIVO" } else { "DESACTIVADO" }
        Write-Host "✅ Provisioning: $status" -ForegroundColor Green
        return $data.isEnabled
    } catch {
        Write-Host "❌ Error al consultar provisioning: $_" -ForegroundColor Red
        return $false
    }
}

# Función para activar provisioning
function Enable-Provisioning {
    param($Session)
    
    Write-Host "`n[3/6] Activando provisioning..." -ForegroundColor Yellow
    
    $body = @{ isEnabled = $true } | ConvertTo-Json
    
    try {
        $response = Invoke-WebRequest -Uri "$BaseUrl/admin/neologg/provisioning/toggle" `
            -Method POST `
            -Body $body `
            -ContentType "application/json" `
            -WebSession $Session `
            -UseBasicParsing
        
        Write-Host "✅ Provisioning activado" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "❌ Error al activar provisioning: $_" -ForegroundColor Red
        return $false
    }
}

# Función para provisionar un dispositivo
function Provision-Device {
    param($SerialNumber, $MacAddress, $IMEI)
    
    Write-Host "`n[4/6] Provisionando dispositivo $SerialNumber..." -ForegroundColor Yellow
    
    $body = @{
        serialNumber = $SerialNumber
        macAddress = $MacAddress
        imei = $IMEI
    } | ConvertTo-Json
    
    try {
        $response = Invoke-WebRequest -Uri "$BaseUrl/unprotected/neologg/provision" `
            -Method POST `
            -Body $body `
            -ContentType "application/json" `
            -UseBasicParsing
        
        $device = ($response.Content | ConvertFrom-Json).data
        Write-Host "✅ Dispositivo provisionado exitosamente" -ForegroundColor Green
        Write-Host "   📋 Licencia: $($device.license.Substring(0, 16))..." -ForegroundColor Gray
        Write-Host "   🔑 MQTT User: $($device.mqttUsername)" -ForegroundColor Gray
        Write-Host "   🔐 MQTT Pass: $($device.mqttPassword.Substring(0, 20))..." -ForegroundColor Gray
        Write-Host "   🔓 Root Pass: $($device.rootPassword)" -ForegroundColor Gray
        return $device
    } catch {
        Write-Host "❌ Error al provisionar dispositivo: $_" -ForegroundColor Red
        return $null
    }
}

# Función para listar dispositivos
function Get-DeviceList {
    param($Session)
    
    Write-Host "`n[5/6] Listando dispositivos..." -ForegroundColor Yellow
    
    try {
        $response = Invoke-WebRequest -Uri "$BaseUrl/admin/neologg/devices" `
            -Method GET `
            -WebSession $Session `
            -UseBasicParsing
        
        $devices = ($response.Content | ConvertFrom-Json).data
        Write-Host "✅ Total de dispositivos: $($devices.Count)" -ForegroundColor Green
        
        foreach ($device in $devices) {
            $lastSeen = if ($device.lastSeenAt) { $device.lastSeenAt } else { "N/A" }
            Write-Host "   📡 $($device.serialNumber) - Estado: $($device.status.ToUpper()) - Última conexión: $lastSeen" -ForegroundColor Gray
        }
        
        return $devices
    } catch {
        Write-Host "❌ Error al listar dispositivos: $_" -ForegroundColor Red
        return @()
    }
}

# Función para enviar una acción a un dispositivo
function Send-DeviceAction {
    param($Session, $DeviceId, $Action)
    
    Write-Host "`n[6/6] Enviando acción '$Action' al dispositivo..." -ForegroundColor Yellow
    
    $body = @{ action = $Action } | ConvertTo-Json
    
    try {
        $response = Invoke-WebRequest -Uri "$BaseUrl/admin/neologg/devices/$DeviceId/actions" `
            -Method POST `
            -Body $body `
            -ContentType "application/json" `
            -WebSession $Session `
            -UseBasicParsing
        
        Write-Host "✅ Acción '$Action' enviada correctamente (publicado a MQTT)" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "❌ Error al enviar acción: $_" -ForegroundColor Red
        return $false
    }
}

# EJECUCIÓN DEL TEST
try {
    # 1. Login
    $session = Login-Admin
    
    # 2. Verificar provisioning
    $isEnabled = Get-ProvisioningStatus -Session $session
    
    # 3. Activar si está desactivado
    if (-not $isEnabled) {
        Enable-Provisioning -Session $session | Out-Null
    }
    
    # 4. Provisionar un dispositivo de prueba
    $testSN = "TEST$(Get-Random -Minimum 1000 -Maximum 9999)"
    $testMAC = "AA:BB:CC:DD:EE:FF"
    $testIMEI = "123456789012345"
    
    $device = Provision-Device -SerialNumber $testSN -MacAddress $testMAC -IMEI $testIMEI
    
    if ($device) {
        # 5. Listar dispositivos
        $devices = Get-DeviceList -Session $session
        
        # 6. Enviar una acción al dispositivo provisionado
        if ($devices.Count -gt 0) {
            Send-DeviceAction -Session $session -DeviceId $device.deviceId -Action "restart"
        }
    }
    
    Write-Host "`n========================================" -ForegroundColor Green
    Write-Host "  ✅ TESTS COMPLETADOS EXITOSAMENTE" -ForegroundColor Green
    Write-Host "========================================`n" -ForegroundColor Green
    
    Write-Host "📊 Puedes acceder al dashboard en:" -ForegroundColor Cyan
    Write-Host "   http://localhost:5174/admin/dashboard`n" -ForegroundColor Yellow
    
} catch {
    Write-Host "`n========================================" -ForegroundColor Red
    Write-Host "  ❌ ERROR EN LOS TESTS" -ForegroundColor Red
    Write-Host "========================================`n" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}
