/*
LEEWAY HEADER — DO NOT REMOVE
REGION: CRM / MILWAUKEE_CAMPAIGN_TEST
TAG: LEEWAY-MKE-NORTH-AVENUE-CAMPAIGN-TEST-20261105
WHO: Creator (authority), assistant (implementation)
WHAT: Guard original ERP, campaign source integrity, no fake outreach and privacy boundaries
WHEN: 2026-11-05
WHERE: canonical Leeway-Agentic-CRM-ERP/tests
WHY: Prevent a customer demo from treating research, generated drafts or demo metrics as completed work
HOW: Node built-in test framework; JS check; readonly fixtures
AUTHORIZED ROLES: CI test only; not Veritas or production receipt
LICENSE: Apache-2.0
*/
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const js=readFileSync(new URL('../modules/milwaukee-outreach.js',import.meta.url),'utf8');
const research=JSON.parse(readFileSync(new URL('../data/milwaukee-appointment-first-20261105.json',import.meta.url),'utf8'));
test('new module is valid JavaScript',()=>{
 const r=spawnSync(process.execPath,['--check',new URL('../modules/milwaukee-outreach.js',import.meta.url).pathname],{encoding:'utf8'});
 assert.equal(r.status,0,r.stderr);
});
test('all ten original ERP and engagement panes retained',()=>{
 for(const id of ['crm','bom','manufacturing','warehousing','device_bridge','integrations','infrastructure','voice_capture','todays_route','campaigns'])
  assert.ok(html.includes('id="tab-'+id+'"'),id+' missing');
 assert.ok(html.includes('id="lw-mke-campaign-root"'));
 assert.ok(html.includes('src="./modules/milwaukee-outreach.js"'));
 assert.ok(html.includes('LEGACY DEMONSTRATION DATA'));
});
test('public research is uncontacted, dated and without private home coordinates',()=>{
 assert.equal(research.schema,'leeway.crm.milwaukee.appointment-campaign.v1');
 assert.equal(research.asOf,'2026-11-05');
 assert.equal(research.areaBoundaryVerified,false);
 assert.ok(research.prospects.length>=7);
 assert.ok(research.prospects.every(p=>p.initialStatus==='RESEARCHED_NOT_CONTACTED'&&p.ownerVerified===false));
 assert.ok(research.opportunities.every(p=>p.url.startsWith('https://')&&p.qualifier.length>25));
 assert.ok(!JSON.stringify(research).includes('2116 N'));
});
test('no autonomous external contact and consent required for status changes',()=>{
 assert.ok(js.includes('window.confirm(msg)'),'human authorization required');
 assert.ok(js.includes('externalSendPerformed:false'));
 assert.ok(js.includes('source.prospects.map'),'research converted into private browser records only');
 assert.ok(js.includes('localStorage.setItem(KEY'),'private browser storage');
 assert.ok(!/fetch\s*\(\s*['"]https?:\/\/[^'"]*\/send/i.test(js));
 assert.ok(!/navigator\.geolocation\.getCurrentPosition/.test(js));
 assert.ok(js.includes('Copy introduction'));
});
test('campaign links to existing Campaigns, Voice Capture and Today’s Route without replacing them',()=>{
 for(const id of ['lw-campaign-name','lw-campaign-channel','lw-campaign-content','lw-voice-title','lw-voice-link','lw-route-title','lw-route-place'])
  assert.ok(html.includes('id="'+id+'"'),id+' not in canonical UI');
 assert.ok(js.includes("window.switchTab('voice_capture')"));
 assert.ok(js.includes("window.switchTab('todays_route')"));
});
