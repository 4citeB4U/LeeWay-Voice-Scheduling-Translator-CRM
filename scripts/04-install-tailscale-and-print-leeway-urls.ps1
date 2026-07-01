# LeeWay Private Network - Layer 4
# Installs/starts Tailscale and prints private LeeWay service URLs.
# Run in PowerShell. If install needs elevation, open PowerShell as Administrator.

$ErrorActionPreference = "Stop"

function Find-Tailscale {
  $cmd = Get-Command tailscale.exe -ErrorAction SilentlyContinue
  if ($cmd) { return $cmd.Source }
  $paths = @(
    "$env:ProgramFiles\Tailscale\tailscale.exe",
    "$env:LOCALAPPDATA\Tailscale\tailscale.exe"
  )
  foreach ($p in $paths) { if (Test-Path $p) { return $p } }
  return $null
}

Write-Host "=== LeeWay Tailscale Private Network Setup ===" -ForegroundColor Cyan

$tailscale = Find-Tailscale
if (-not $tailscale) {
  Write-Host "Tailscale not found. Installing with winget..." -ForegroundColor Yellow
  winget install --id Tailscale.Tailscale -e --accept-source-agreements --accept-package-agreements
  Start-Sleep -Seconds 5
  $tailscale = Find-Tailscale
}

if (-not $tailscale) {
  throw "Tailscale install was not detected. Install Tailscale manually, then rerun this script."
}

Write-Host "Using Tailscale: $tailscale" -ForegroundColor Green

try { Start-Service Tailscale -ErrorAction SilentlyContinue } catch {}

Write-Host "Checking Tailscale status..." -ForegroundColor Cyan
$statusText = & $tailscale status 2>&1
$statusText | Out-Host

if ($statusText -match "Logged out|stopped|NeedsLogin|not running") {
  Write-Host "Starting Tailscale login. A browser window may open." -ForegroundColor Yellow
  & $tailscale up
}

$ip = (& $tailscale ip -4 2>$null | Select-Object -First 1).Trim()
if (-not $ip) {
  Write-Warning "Could not read Tailscale IP yet. Run 'tailscale up', sign in, then rerun this script."
  exit 1
}

Write-Host "" 
Write-Host "=== LeeWay Private URLs ===" -ForegroundColor Green
Write-Host "Tailscale IP: $ip"
Write-Host ""
Write-Host "LeeWay Bridge:        http://$ip:8787"
Write-Host "Ollama:               http://$ip:11434"
Write-Host "Runtime Fabric:       http://$ip:4001"
Write-Host "Hybrid Fabric:        http://$ip:8777"
Write-Host "Media Ingestion:      http://$ip:5300"
Write-Host "Media Router:         http://$ip:5301"
Write-Host "Agent Center:         http://$ip:8860"
Write-Host "MCP Agent Center:     http://$ip:8861"
Write-Host "Worker Center:        http://$ip:8862"
Write-Host "MCP Center:           http://$ip:8863"
Write-Host "Voice Kernel:         http://$ip:8092"
Write-Host "Vision Kernel:        http://$ip:8093"
Write-Host "LeeWay Jitsi HTTP:    http://$ip:8008"
Write-Host "LeeWay Jitsi HTTPS:   https://$ip:8443"
Write-Host ""
Write-Host "CRM settings:" -ForegroundColor Cyan
Write-Host "Bridge URL = http://$ip:8787"
Write-Host "Meeting Provider = LeeWay Jitsi"
Write-Host "Meeting Base URL = https://$ip:8443"
Write-Host "Default Model = qwen3:latest"
Write-Host "Vision Model = qwen2.5vl:7b"
Write-Host ""
Write-Host "Layer 4 complete." -ForegroundColor Green
