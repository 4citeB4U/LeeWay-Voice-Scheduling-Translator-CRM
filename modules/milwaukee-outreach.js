/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY_CRM / MILWAUKEE_APPOINTMENT_CAMPAIGN
TAG: LEEWAY-CRM-MKE-APPOINTMENT-FIRST-20261105
WHAT: Researched Milwaukee prospects, human-controlled outreach, resource briefs, and digital field notes
WHY: Operate LeeWay's existing CRM as proof, not create a second sales system or use paper
WHO: LeeWay Industries creator and approved CRM operators; assistant as implementation contributor
WHERE: Existing CRM Campaigns tab, modules/milwaukee-outreach.js
WHEN: 2026-11-05
HOW: Immutable public research source + private browser-state deltas + approved human actions
AUTHORIZED ROLES: Creator for contact state changes; public research read only
LICENSE: Apache-2.0; no third-party business/model data redistributed beyond public listing facts
PROOF LAW: Research != outreach; draft != sent; proposed != confirmed; generated != executed.
*/
(function(){
 'use strict';
 const KEY='leeway.crm.mke.appointments.v1';
 const rootId='lw-mke-campaign-root';
 const dataFile='./data/milwaukee-appointment-first-20261105.json';
 const outcomes=new Set(['RESEARCHED_NOT_CONTACTED','CONTACT_DETAILS_VERIFIED','CALL_ATTEMPTED','EMAIL_DRAFTED_NOT_SENT','MEETING_REQUESTED','MEETING_CONFIRMED','FOLLOW_UP','DECLINED','DO_NOT_CONTACT']);
 const activeContact=new Set(['CALL_ATTEMPTED','MEETING_REQUESTED','MEETING_CONFIRMED','FOLLOW_UP','DECLINED','DO_NOT_CONTACT']);
 let source=null;
 let current=null;
 const el=id=>document.getElementById(id);
 const str=v=>String(v??'');
 const save=()=>{
  try{localStorage.setItem(KEY,JSON.stringify(current));return true;}
  catch(e){window.alert('Unable to save CRM browser state. Export it first. '+e.message);return false;}
 };
 function restore(){
  try{
   const obj=JSON.parse(localStorage.getItem(KEY)||'null');
   if(obj?.schema==='leeway.crm.mke.private.v1' && Array.isArray(obj.records) && Array.isArray(obj.events)){
    current=obj;return;
   }
  }catch(_){}
  current=null;
 }
 function add(tag,text,className=''){
  const node=document.createElement(tag);
  if(className)node.className=className;
  if(text!==undefined)node.textContent=str(text);
  return node;
 }
 function btn(text,action,cls=''){
  const b=add('button',text,'px-3 py-2 rounded-lg border border-slate-600 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white '+cls);
  b.type='button';b.addEventListener('click',action);return b;
 }
 function aLink(label,url){
  const a=add('a',label,'underline text-cyan-300 text-xs');
  a.target='_blank';a.rel='noopener noreferrer';a.href=url;return a;
 }
 const idOf=p=>current?.records?.find(r=>r.id===p.id);
 const setMessage=(text)=>{const x=el('lw-mke-message');if(x)x.textContent=str(text);};
 function metric(){
  const box=el('lw-mke-metrics');if(!box)return;
  box.replaceChildren();
  const n=current?.records.length||0;
  const attempted=current?.records.filter(r=>r.status==='CALL_ATTEMPTED').length||0;
  const confirmed=current?.records.filter(r=>r.status==='MEETING_CONFIRMED').length||0;
  const doNot=current?.records.filter(r=>r.status==='DO_NOT_CONTACT').length||0;
  box.textContent='Research records: '+n+' · Calls logged by operator: '+attempted+' · Confirmed meetings logged by operator: '+confirmed+' · Suppressed: '+doNot+' · Automated contacts sent: 0';
 }
 function init(){
  if(!source)return setMessage('Public research data did not load. No campaign was created.');
  if(current)return setMessage('Campaign already initialized. Existing notes and outcomes were preserved.');
  current={schema:'leeway.crm.mke.private.v1',campaignId:source.campaignId,
    initializedAt:new Date().toISOString(),records:source.prospects.map(p=>({
      id:p.id,status:'RESEARCHED_NOT_CONTACTED',notes:'',nextDate:'',nextTime:'',lastUpdated:null
    })),events:[]};
  if(save()){setMessage('Campaign initialized on this browser. No contact or appointment has been performed.');render();}
 }
 const statusText=s=>str(s).replaceAll('_',' ').toLowerCase();
 function formatBrief(p){
  const related=source.opportunities.filter(o=>o.tags.some(t=>p.industry.includes(t)||t.includes(p.industry)));
  const pieces=[
    'LEEWAY INDUSTRIES — PUBLIC RESOURCE SNAPSHOT',
    'Prepared for: '+p.name+' ('+p.industry+')',
    'Source review: '+source.asOf,
    'Customer engagement conversation starter: '+p.engagementIdea,
    'Potential operations topics: '+p.ecosystemTopics.join('; '),
    'Explore official resources (eligibility NOT checked):'
  ];
  related.forEach(o=>pieces.push('- '+o.title+': '+o.url+'\n  '+o.qualifier));
  pieces.push('No grant, discount, investment, eligibility, supplier contract, or business outcome is guaranteed.');
  pieces.push('No endorsement or partnership from these programs is implied.');
  return pieces.join('\n');
 }
 async function copy(text){
  try{await navigator.clipboard.writeText(text);setMessage('Copied to clipboard. No message was sent.');}
  catch(_){setMessage('Clipboard unavailable; open your browser in a secure context to copy.');}
 }
 function scriptedCall(p){
  return 'Hello, this is LeeWay Industries. We are meeting with Milwaukee businesses on North Avenue to learn about customer engagement and day-to-day operations. Is the owner or person responsible for business operations available for a brief introductory conversation? We also research public local business-support resources. We are requesting an appointment, not asking you to purchase software over the phone.';
 }
 function setOutcome(p,rec){
  const area=el('lw-mke-update-'+p.id);
  if(area){area.remove();return;}
  const card=el('lw-mke-card-'+p.id);
  const panel=add('div',undefined,'mt-3 p-3 bg-slate-950 border border-slate-600 rounded-lg space-y-2');
  panel.id='lw-mke-update-'+p.id;
  panel.append(add('label','Result / truthful activity status','block text-xs text-slate-300'));
  const select=add('select',undefined,'w-full bg-slate-950 border border-slate-600 rounded-lg p-2 text-xs text-white');
  select.id='lw-mke-status-'+p.id;
  for(const item of outcomes){
    const opt=add('option',statusText(item));
    opt.value=item;if(item===rec.status)opt.selected=true;select.append(opt);
  }
  panel.append(select,add('label','What actually happened? (no assumptions)','block text-xs text-slate-300'));
  const note=add('textarea',undefined,'w-full bg-slate-950 border border-slate-600 rounded-lg p-2 text-xs text-white');
  note.maxLength=1200;note.rows=2;note.placeholder='Facts observed, identity of contact if voluntarily shared, and the next action';
  note.value=rec.notes||'';panel.append(note);
  panel.append(add('label','Follow-up or requested appointment date (not confirmed unless explicitly agreed)','block text-xs text-slate-300'));
  const date=add('input',undefined,'w-full bg-slate-950 border border-slate-600 rounded-lg p-2 text-xs text-white');
  date.type='date';date.value=rec.nextDate||'';panel.append(date);
  const time=add('input',undefined,'w-full bg-slate-950 border border-slate-600 rounded-lg p-2 text-xs text-white');
  time.type='time';time.value=rec.nextTime||'';panel.append(time);
  const saveButton=btn('Review and save actual outcome',()=>{
    const next=select.value,notes=note.value.trim();
    if(!outcomes.has(next))return setMessage('Invalid contact status');
    if(activeContact.has(next)&&notes.length<10)return setMessage('Enter a factual activity note before changing contact status.');
    const msg='Record '+p.name+' as '+statusText(next)+'? This confirms you personally observed the activity; it does not send a message or book an appointment.';
    if(!window.confirm(msg))return;
    rec.status=next;rec.notes=notes;rec.nextDate=date.value;rec.nextTime=time.value;
    rec.lastUpdated=new Date().toISOString();
    current.events.push({recordId:p.id,eventType:'OWNER_RECORDED_STATUS',status:next,when:rec.lastUpdated,
      note:notes,channel:'MANUAL_ENTRY',externalSendPerformed:false,providerReceipt:null});
    if(save()){setMessage('Activity recorded locally. No external contact was executed by the CRM.');render();}
  });
  panel.append(saveButton);
  card.append(panel);
 }
 function prepareCampaign(){
  if(!source)return;
  const set=(id,text)=>{if(el(id))el(id).value=text;};
  set('lw-campaign-name',source.displayName);
  set('lw-campaign-channel','Phone Calls');
  set('lw-campaign-audience','Milwaukee North Avenue independent businesses; appointment-first, public-source verified');
  set('lw-campaign-date','2026-11-09');
  set('lw-campaign-content',[
   'OBJECTIVE: Ask for a 15–20 minute business operations introduction, not sell websites or AI.',
   'RULES: Human-reviewed contact details. No automated cold calls, texts, prerecorded or AI voice outreach without legal/consent checks.',
   'START: '+scriptedCall({}),
   'NEXT: Learn one customer-engagement problem. Only then share matched city/state resources and offer a modest pilot.',
   'NOTE: The CRM button creates a DRAFT, not a sent campaign.'
  ].join('\n'));
  setMessage('Existing CRM Campaign form populated; review it and click Save campaign draft separately. No outreach sent.');
 }
 function doExport(){
  if(!current)return setMessage('Initialize the campaign first.');
  const text=JSON.stringify({exportedAt:new Date().toISOString(),sourceVersion:source?.asOf||null,...current},null,2);
  const url=URL.createObjectURL(new Blob([text],{type:'application/json'}));
  const a=add('a');a.href=url;a.download='leeway-milwaukee-private-campaign-backup.json';document.body.append(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),2000);setMessage('Exported a private browser data backup. No cloud synchronization occurred.');
 }
 function render(){
  metric();
  const holder=el('lw-mke-prospects');if(!holder)return;holder.replaceChildren();
  if(!source)return;
  for(const p of source.prospects){
   const rec=idOf(p);
   const card=add('div',undefined,'border border-slate-700 bg-slate-950 rounded-xl p-4 space-y-2');
   card.id='lw-mke-card-'+p.id;
   card.append(add('strong',p.name,'text-white text-sm block'));
   card.append(add('div',p.industry+' · '+p.address,'text-xs text-slate-300'));
   card.append(add('div',p.engagementIdea,'text-xs text-slate-400'));
   card.append(add('div','Status: '+(rec?statusText(rec.status):'Research only — not added to private queue'),'text-xs text-amber-300 font-semibold'));
   if(p.sourceUrl)card.append(aLink('Official organization source',p.sourceUrl));
   const buttons=add('div',undefined,'flex flex-wrap gap-2');
   buttons.append(btn('Copy introduction',()=>copy(scriptedCall(p))));
   buttons.append(btn('Copy resource brief',()=>copy(formatBrief(p))));
   if(p.phone){const link=aLink('Dial public listing', 'tel:'+p.phone.replace(/[^+0-9]/g,''));buttons.append(link);}
   buttons.append(aLink('Map', 'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(p.address)));
   if(rec){
    buttons.append(btn('Record actual result',()=>setOutcome(p,rec)));
    buttons.append(btn('Use Voice Capture',()=>{
      const title=el('lw-voice-title'),link=el('lw-voice-link');
      if(title)title.value=p.name+' — appointment follow-up';
      if(link)link.value=p.id;
      if(typeof window.switchTab==='function')window.switchTab('voice_capture');
      setMessage('Voice Capture opened for the selected business. Recording remains OFF until participant consent and manual start.');
    }));
    buttons.append(btn('Draft route event',()=>{
      if(el('lw-route-title'))el('lw-route-title').value=p.name+' — proposed appointment';
      if(el('lw-route-place'))el('lw-route-place').value=p.address;
      if(el('lw-route-date')&&rec.nextDate)el('lw-route-date').value=rec.nextDate;
      if(el('lw-route-time')&&rec.nextTime)el('lw-route-time').value=rec.nextTime;
      if(typeof window.switchTab==='function')window.switchTab('todays_route');
      setMessage('Today’s Route prefilled only. An actual appointment is not booked.');
    }));
   }
   card.append(buttons);
   holder.append(card);
  }
  const resources=el('lw-mke-resources');resources.replaceChildren();
  for(const o of source.opportunities){
   const card=add('div',undefined,'border-l-2 border-cyan-700 px-3 py-2 my-2');
   card.append(aLink(o.title,o.url),add('p',o.summary,'text-xs text-slate-300'),add('p',o.qualifier,'text-xs text-amber-300'));
   resources.append(card);
  }
 }
 document.addEventListener('DOMContentLoaded',async()=>{
  if(!el(rootId))return;
  restore();
  el('lw-mke-init').onclick=init;
  el('lw-mke-campaign-draft').onclick=prepareCampaign;
  el('lw-mke-export').onclick=doExport;
  metric();
  try{
   const rsp=await fetch(dataFile,{cache:'no-store'});
   if(!rsp.ok)throw Error('Public research source unavailable');
   const json=await rsp.json();
   if(json.schema!=='leeway.crm.milwaukee.appointment-campaign.v1'||!Array.isArray(json.prospects)||!Array.isArray(json.opportunities))
    throw Error('Unexpected campaign source schema');
   source=json;
   el('lw-mke-date').textContent='Source reviewed: '+source.asOf+' · '+source.prospects.length+' researched candidates · '+source.opportunities.length+' resource references';
   render();
   setMessage(current?'Private CRM campaign restored from this browser; no cloud sync inferred.':'Public research loaded. Start campaign to create private browser records; nothing will be sent.');
  }catch(e){setMessage('Campaign research could not be loaded: '+e.message);}
 });
})();
