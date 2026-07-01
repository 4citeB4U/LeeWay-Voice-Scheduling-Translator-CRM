# LeeWay Local Bridge Install - Layer 3
# Tests local model calls and prints CRM connection settings.

$ErrorActionPreference = "Stop"

Write-Host "Testing local model through bridge..." -ForegroundColor Cyan

$Payload = @{
  task = "extract_lead"
  model = "qwen3:latest"
  note = "I just walked into Ballers Club Barbershop. I spoke with Marcus the manager. They care about no-shows, memberships, reviews, and social media. I pitched the $250 AI Tune-Up. Follow up tomorrow."
  leewayStandard = $true
}
$Body = $Payload | ConvertTo-Json -Depth 8

$AssistantResult = Invoke-RestMethod -Uri "http://localhost:8787/assistant" -Method POST -ContentType "application/json" -Body $Body -TimeoutSec 120
$AssistantResult | ConvertTo-Json -Depth 10 | Out-Host

Write-Host "Getting available Ollama models..." -ForegroundColor Cyan
$Models = Invoke-RestMethod -Uri "http://localhost:8787/models" -Method GET -TimeoutSec 30
$Models | ConvertTo-Json -Depth 8 | Out-Host

Write-Host ""
Write-Host "CRM settings to enter in the GitHub Pages app:" -ForegroundColor Green
Write-Host "Connection Mode: LeeWay Bridge"
Write-Host "Bridge URL on this PC: http://localhost:8787"
Write-Host "Bridge URL from Android on same Wi-Fi: http://YOUR-PC-IP:8787"
Write-Host "Default Model: qwen3:latest"
Write-Host "Vision Model: qwen2.5vl:7b"
Write-Host ""
Write-Host "To find your PC IP:" -ForegroundColor Yellow
Write-Host "ipconfig | findstr IPv4"
Write-Host ""
Write-Host "Layer 3 complete." -ForegroundColor Green
