# LeeWay Local Assistant Bridge

This bridge connects the GitHub Pages LeeWay CRM to the local LeeWay Docker ecosystem.

## Correct LeeWay identity block

Leonard Lee  
LeeWay Industries | LeeWay Innovations  
Milwaukee, WI 53205  
Phone: 414-303-8580  
Fax: 414-239-8531  
Email: leonardlee6@outlook.com  
Resume: https://4citeb4u.github.io/Leonard-Lee-Resume/  
GitHub: https://github.com/4citeB4U

## Local services the bridge targets

- Ollama: `http://host.docker.internal:11434`
- Runtime Fabric: `http://host.docker.internal:4001`
- Hybrid Fabric: `http://host.docker.internal:8777`
- Media Ingestion: `http://host.docker.internal:5300`
- Media Router: `http://host.docker.internal:5301`
- Agent Center: `http://host.docker.internal:8860`
- MCP Agent Center: `http://host.docker.internal:8861`
- Worker Center: `http://host.docker.internal:8862`
- MCP Center: `http://host.docker.internal:8863`
- Voice Kernel: `http://host.docker.internal:8092`
- Vision Kernel: `http://host.docker.internal:8093`

## Default models

- Default reasoning model: `qwen3:latest`
- Vision model: `qwen2.5vl:7b`
- Coding models available for development: `qwen2.5-coder`, `deepseek-coder`

## Install layers

Run these PowerShell scripts in order:

```powershell
scripts/01-create-local-bridge-files.ps1
scripts/02-build-and-run-bridge.ps1
scripts/03-test-and-connect-crm.ps1
```

The local bridge starts at:

```text
http://localhost:8787
```

For your phone on the same Wi-Fi, use your PC IP address:

```text
http://YOUR-PC-IP:8787
```

Find your PC IP with:

```powershell
ipconfig | findstr IPv4
```

## LeeWay Standards Gate

All assistant actions must follow:

1. Intent
2. Context
3. Generation
4. Validation
5. Decision

The bridge should never auto-send email, auto-schedule a meeting, or overwrite CRM records without user approval.
