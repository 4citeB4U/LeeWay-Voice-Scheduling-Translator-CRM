# LeeWay Local Bridge Install - Layer 1
# Creates local bridge files at C:\LeeWay\local-assistant-bridge

$ErrorActionPreference = "Stop"
$Root = "C:\LeeWay\local-assistant-bridge"
$Bridge = Join-Path $Root "bridge"
New-Item -ItemType Directory -Force -Path $Bridge | Out-Null

@'
{
  "name": "leeway-local-assistant-bridge",
  "version": "0.1.0",
  "description": "Local LeeWay bridge between GitHub Pages CRM and Docker/Ollama services.",
  "type": "module",
  "main": "server.js",
  "scripts": { "start": "node server.js" },
  "engines": { "node": ">=18" },
  "dependencies": {}
}
'@ | Set-Content -Path (Join-Path $Bridge "package.json") -Encoding UTF8

@'
FROM node:20-alpine
WORKDIR /app
COPY package.json ./
COPY server.js ./
EXPOSE 8787
CMD ["npm", "start"]
'@ | Set-Content -Path (Join-Path $Bridge "Dockerfile") -Encoding UTF8

@'
services:
  leeway-local-assistant-bridge:
    build:
      context: ./bridge
    container_name: leeway-local-assistant-bridge
    restart: unless-stopped
    ports:
      - "8787:8787"
    environment:
      LEEWAY_BRIDGE_PORT: "8787"
      OLLAMA_URL: "http://host.docker.internal:11434"
      LEEWAY_DEFAULT_MODEL: "qwen3:latest"
      LEEWAY_VISION_MODEL: "qwen2.5vl:7b"
      LEEWAY_ALLOWED_ORIGIN: "*"
      LEEWAY_RUNTIME_FABRIC: "http://host.docker.internal:4001"
      LEEWAY_HYBRID_FABRIC: "http://host.docker.internal:8777"
      LEEWAY_MEDIA_INGESTION: "http://host.docker.internal:5300"
      LEEWAY_MEDIA_ROUTER: "http://host.docker.internal:5301"
      LEEWAY_AGENT_CENTER: "http://host.docker.internal:8860"
      LEEWAY_MCP_AGENT_CENTER: "http://host.docker.internal:8861"
      LEEWAY_WORKER_CENTER: "http://host.docker.internal:8862"
      LEEWAY_MCP_CENTER: "http://host.docker.internal:8863"
      LEEWAY_VOICE_KERNEL: "http://host.docker.internal:8092"
      LEEWAY_VISION_KERNEL: "http://host.docker.internal:8093"
    extra_hosts:
      - "host.docker.internal:host-gateway"
'@ | Set-Content -Path (Join-Path $Root "docker-compose.yml") -Encoding UTF8

@'
import http from "node:http";

const PORT = Number(process.env.LEEWAY_BRIDGE_PORT || 8787);
const OLLAMA_URL = process.env.OLLAMA_URL || "http://host.docker.internal:11434";
const DEFAULT_MODEL = process.env.LEEWAY_DEFAULT_MODEL || "qwen3:latest";
const VISION_MODEL = process.env.LEEWAY_VISION_MODEL || "qwen2.5vl:7b";

const SERVICES = {
  bridge: `http://localhost:${PORT}`,
  ollama: OLLAMA_URL,
  runtimeFabric: process.env.LEEWAY_RUNTIME_FABRIC || "http://host.docker.internal:4001",
  hybridFabric: process.env.LEEWAY_HYBRID_FABRIC || "http://host.docker.internal:8777",
  mediaIngestion: process.env.LEEWAY_MEDIA_INGESTION || "http://host.docker.internal:5300",
  mediaRouter: process.env.LEEWAY_MEDIA_ROUTER || "http://host.docker.internal:5301",
  agentCenter: process.env.LEEWAY_AGENT_CENTER || "http://host.docker.internal:8860",
  mcpAgentCenter: process.env.LEEWAY_MCP_AGENT_CENTER || "http://host.docker.internal:8861",
  workerCenter: process.env.LEEWAY_WORKER_CENTER || "http://host.docker.internal:8862",
  mcpCenter: process.env.LEEWAY_MCP_CENTER || "http://host.docker.internal:8863",
  voiceKernel: process.env.LEEWAY_VOICE_KERNEL || "http://host.docker.internal:8092",
  visionKernel: process.env.LEEWAY_VISION_KERNEL || "http://host.docker.internal:8093"
};

function cors(res){
  res.setHeader("Access-Control-Allow-Origin", process.env.LEEWAY_ALLOWED_ORIGIN || "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}
async function readJson(req){
  const chunks=[]; for await (const c of req) chunks.push(c);
  const body=Buffer.concat(chunks).toString("utf8");
  if(!body) return {}; try{return JSON.parse(body)}catch{return {raw:body}}
}
function send(res,status,data){cors(res);res.writeHead(status,{"Content-Type":"application/json"});res.end(JSON.stringify(data,null,2));}
async function fetchJson(url,options={}){const r=await fetch(url,options);const text=await r.text();try{return{ok:r.ok,status:r.status,data:JSON.parse(text),text}}catch{return{ok:r.ok,status:r.status,data:null,text}}}

function systemPrompt(task){return `You are LeeWay Local Assistant operating under LeeWay Standards. Return compact valid JSON only. Workflow: Intent, Context, Generation, Validation, Decision. Never claim an email was sent, meeting scheduled, or CRM record changed unless user approved it. Task: ${task}`;}
function taskPrompt(payload){return `${systemPrompt(payload.task||"analyze_lead")}\n\nReturn JSON keys: intent, lead, summary, painPoints, opportunities, riskFlags, missingInfo, followUpMessage, callScript, score, nextActions, leewayGate.\n\nPayload:\n${JSON.stringify(payload,null,2)}`;}
async function ollamaGenerate(payload){return fetchJson(`${OLLAMA_URL}/api/generate`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:payload.model||DEFAULT_MODEL,prompt:taskPrompt(payload),stream:false,options:{temperature:0.1}})});}
async function ollamaVision(payload){const body={model:payload.model||VISION_MODEL,prompt:taskPrompt(payload),stream:false,options:{temperature:0.1}};if(payload.imageBase64)body.images=[payload.imageBase64.replace(/^data:image\/\w+;base64,/,"")];return fetchJson(`${OLLAMA_URL}/api/generate`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});}
async function health(){const checks={};checks.ollama=await fetchJson(`${OLLAMA_URL}/api/tags`).catch(e=>({ok:false,error:e.message}));for(const [name,url] of Object.entries(SERVICES)){if(name==="ollama"||name==="bridge")continue;checks[name]=await fetchJson(url).catch(e=>({ok:false,error:e.message}));}return{ok:true,bridge:{port:PORT,defaultModel:DEFAULT_MODEL,visionModel:VISION_MODEL},services:SERVICES,checks};}

const server=http.createServer(async(req,res)=>{cors(res);if(req.method==="OPTIONS")return res.end();try{const url=new URL(req.url,`http://localhost:${PORT}`);if(url.pathname==="/"||url.pathname==="/health")return send(res,200,await health());if(url.pathname==="/models")return send(res,200,await fetchJson(`${OLLAMA_URL}/api/tags`));if(url.pathname==="/assistant"&&req.method==="POST"){const payload=await readJson(req);const result=await ollamaGenerate(payload);const raw=result?.data?.response||result.text||"";let parsed;try{parsed=JSON.parse(raw.replace(/^```json/i,"").replace(/^```/i,"").replace(/```$/i,"").trim())}catch{parsed={summary:raw,riskFlags:["Model response was not strict JSON. Review before saving."],leewayGate:{decision:"Requires user approval before CRM update, email, or calendar action."}}}return send(res,200,{ok:true,model:payload.model||DEFAULT_MODEL,result:parsed,raw});}if(url.pathname==="/vision"&&req.method==="POST"){const payload=await readJson(req);payload.task=payload.task||"image_to_lead";const result=await ollamaVision(payload);const raw=result?.data?.response||result.text||"";let parsed;try{parsed=JSON.parse(raw.replace(/^```json/i,"").replace(/^```/i,"").replace(/```$/i,"").trim())}catch{parsed={summary:raw,riskFlags:["Vision response requires manual review."]}}return send(res,200,{ok:true,model:payload.model||VISION_MODEL,result:parsed,raw});}if(url.pathname==="/transcribe"&&req.method==="POST"){const payload=await readJson(req);return send(res,200,{ok:true,note:"Audio received. Route to voice kernel once API contract is finalized.",received:{fileName:payload.fileName||"",sizeHint:payload.audioBase64?payload.audioBase64.length:0}});}return send(res,404,{ok:false,error:"Not found"});}catch(err){return send(res,500,{ok:false,error:err.message});}});
server.listen(PORT,"0.0.0.0",()=>{console.log(`LeeWay Local Assistant Bridge running on http://0.0.0.0:${PORT}`);console.log(`Ollama URL: ${OLLAMA_URL}`);});
'@ | Set-Content -Path (Join-Path $Bridge "server.js") -Encoding UTF8

Write-Host "Layer 1 complete. Files written to $Root" -ForegroundColor Green
Write-Host "Next: run scripts/02-build-and-run-bridge.ps1" -ForegroundColor Yellow
