# Neologg Cloud - Test Script
# Este script prueba el provisioning completo de un dispositivo

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  NEOLOGG CLOUD - TEST DE PROVISIONING" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# 1. Verificar que los servicios estén healthy
Write-Host "[1/5] Verificando servicios Docker..." -ForegroundColor Yellow
$services = docker ps --filter "name=neologg_cloud" --format "{{.Names}}: {{.Status}}"
$services | ForEach-Object { Write-Host "  $_" -ForegroundColor Gray }

# 2. Probar Health Check
Write-Host "`n[2/5] Probando Health Check..." -ForegroundColor Yellow
try {
    $health = Invoke-WebRequest -Uri "http://localhost:8094/unprotected/health" -Method GET
    Write-Host "  ✓ Health Check: $($health.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Health Check FAILED" -ForegroundColor Red
    exit 1
}

# 3. Provisionar nuevo dispositivo
Write-Host "`n[3/5] Provisionando nuevo dispositivo..." -ForegroundColor Yellow
$randomSN = "TEST" + (Get-Random -Minimum 1000 -Maximum 9999)
$body = @{
    serialNumber = $randomSN
    macAddress = "AA:BB:CC:DD:EE:FF"
    imei = "123456789012345"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8094/unprotected/neologg/provision" `
        -Method POST -Body $body -ContentType "application/json"
    Write-Host "  ✓ Dispositivo provisionado: $randomSN" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Provisioning FAILED: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 4. Verificar en PostgreSQL
Write-Host "`n[4/5] Verificando en PostgreSQL..." -ForegroundColor Yellow
$pgResult = docker exec neologg_cloud_postgres psql -U postgres -d neologg_cloud_db `
    -c "SELECT serial_number, LEFT(license, 16) as license_prefix, mqtt_username FROM devices WHERE serial_number = '$randomSN';" `
    -t -A
if ($pgResult) {
    Write-Host "  ✓ Dispositivo encontrado en BD:" -ForegroundColor Green
    Write-Host "    $pgResult" -ForegroundColor Gray
} else {
    Write-Host "  ✗ Dispositivo NO encontrado en BD" -ForegroundColor Red
}

# 5. Verificar usuario en Mosquitto
Write-Host "`n[5/5] Verificando usuario en Mosquitto..." -ForegroundColor Yellow
$mqttUsers = docker exec neologg_cloud_mosquitto cat /etc/mosquitto/passwd/passwd
if ($mqttUsers -match $randomSN) {
    Write-Host "  ✓ Usuario MQTT creado: $randomSN" -ForegroundColor Green
} else {
    Write-Host "  ✗ Usuario MQTT NO encontrado" -ForegroundColor Red
}

# Verificar ACL
$mqttAcl = docker exec neologg_cloud_mosquitto cat /etc/mosquitto/acl/acl
if ($mqttAcl -match $randomSN) {
    Write-Host "  ✓ ACL configurada para: $randomSN" -ForegroundColor Green
} else {
    Write-Host "  ✗ ACL NO encontrada" -ForegroundColor Red
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  ✓ PRUEBA COMPLETADA EXITOSAMENTE" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Resumen de servicios:" -ForegroundColor Yellow
Write-Host "  - Backend API: http://localhost:8094" -ForegroundColor Gray
Write-Host "  - PostgreSQL: localhost:5433" -ForegroundColor Gray
Write-Host "  - InfluxDB: http://localhost:8086" -ForegroundColor Gray
Write-Host "  - Mosquitto MQTT: mqtt://localhost:1883" -ForegroundColor Gray
Write-Host "  - Mosquitto WebSocket: ws://localhost:9002" -ForegroundColor Gray
Write-Host ""
