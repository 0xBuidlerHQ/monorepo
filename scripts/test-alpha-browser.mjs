// Opt-in browser acceptance test. Requires the running local TrueOrigin stack.
// Creates two virtual-passkey accounts and one clearly labelled development passport.
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';
const chrome = process.env.CHROME_PATH;
if (!chrome) throw new Error('Set CHROME_PATH to a Chromium/Chrome executable. Start the local stack before running this test.');
const appURL = process.env.APP_URL ?? 'http://localhost:3001';
const adminURL = process.env.ADMIN_URL ?? 'http://localhost:3002';
if (![appURL, adminURL].every(value => ['localhost', '127.0.0.1'].includes(new URL(value).hostname))) throw new Error('This test only runs against local development URLs.');
const profile = await mkdtemp(join(tmpdir(), 'trueorigin-alpha-browser-'));
const child=spawn(chrome,['--headless','--remote-debugging-pipe','--no-first-run','--no-default-browser-check',`--user-data-dir=${profile}`],{stdio:['ignore','ignore','ignore','pipe','pipe']});
let next=0,buffer='';const waiting=new Map();
child.stdio[4].on('data',chunk=>{buffer+=chunk;let end;while((end=buffer.indexOf('\0'))>=0){const msg=JSON.parse(buffer.slice(0,end));buffer=buffer.slice(end+1);const c=waiting.get(msg.id);if(c){waiting.delete(msg.id);msg.error?c.reject(new Error(JSON.stringify(msg.error))):c.resolve(msg.result);}}});
function send(method,params={},sessionId){return new Promise((resolve,reject)=>{const id=++next;waiting.set(id,{resolve,reject});child.stdio[3].write(JSON.stringify({id,method,params,...(sessionId?{sessionId}:{})})+'\0');});}
const pause=ms=>new Promise(r=>setTimeout(r,ms));
async function page(url,auth=false){
 const {browserContextId}=await send('Target.createBrowserContext');
 const {targetId}=await send('Target.createTarget',{url:'about:blank',browserContextId});
 const {sessionId:s}=await send('Target.attachToTarget',{targetId,flatten:true});
 await send('Runtime.enable',{},s);await send('Page.enable',{},s);
 const ev=async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true},s);if(r.exceptionDetails)throw Error(r.exceptionDetails.text+': '+r.exceptionDetails.exception?.description);return r.result.value;};
 const wait=async expression=>{for(let i=0;i<300;i++){if(await ev(expression))return;await pause(150);}throw Error('Timeout '+expression+'\n'+await ev('document.body?.innerText'));};
 const click=async text=>{await wait(`Array.from(document.querySelectorAll('button,a,summary')).some(e=>e.textContent.replace(/↗/g,'').trim()===${JSON.stringify(text)} && !e.disabled)`);await ev(`Array.from(document.querySelectorAll('button,a,summary')).find(e=>e.textContent.replace(/↗/g,'').trim()===${JSON.stringify(text)} && !e.disabled).click()`);await pause(300);};
 const fill=async(selector,value)=>{await ev(`{const input=document.querySelector(${JSON.stringify(selector)});input.focus();input.select();}`);await send('Input.insertText',{text:value},s);};
 const nav=async path=>{await send('Page.navigate',{url:path.startsWith('http')?path:appURL+path},s);await wait(`document.readyState==='complete' && !!document.querySelector('h1')`);await pause(700);};
 let authenticatorId;
 if(auth){await send('WebAuthn.enable',{enableUI:false},s);({authenticatorId}=await send('WebAuthn.addVirtualAuthenticator',{options:{protocol:'ctap2',ctap2Version:'ctap2_1',transport:'internal',hasResidentKey:true,hasUserVerification:true,isUserVerified:true,automaticPresenceSimulation:true}},s));}
 await nav(url);
 return {s,ev,wait,click,fill,nav,authenticatorId};
}
const deadline=setTimeout(()=>{child.kill();process.exit(1)},240000);
try {
 const a=await page('/collection',true);
 await a.click('Create an account');await a.wait(`document.querySelector('[data-header-account]')?.getAttribute('aria-label')==='Open account'`);
 await a.wait(`/^0x[0-9a-f]{40}$/i.test(document.querySelector('[data-header-account]').title)`);
 const walletA=await a.ev(`document.querySelector('[data-header-account]').title`);
 console.log('User A: real browser passkey registration + Kernel address');
 const b=await page('/collection',true);await b.click('Create an account');await b.wait(`/^0x[0-9a-f]{40}$/i.test(document.querySelector('[data-header-account]')?.title ?? '')`);
 const walletB=await b.ev(`document.querySelector('[data-header-account]').title`);assert.notEqual(walletA,walletB);
 console.log('User B: independent passkey registration + Kernel address');
 const cert=String(Date.now()).slice(-12),title='Alpha test Charizard '+cert;
 await a.nav('/submit');await a.wait(`!!document.querySelector('input[name=certificationNumber]')`);
 await a.fill('input[name=certificationNumber]',cert);await a.fill('input[name=contactEmail]','alpha@example.test');await a.click('Submit request');await a.wait(`document.body?.innerText.includes('Request received')`);
 console.log('Submission created from authenticated user A');
 const admin=await page(adminURL);await admin.wait(`document.body?.innerText.includes(${JSON.stringify(cert)})`);
 await admin.ev(`Array.from(document.querySelectorAll('details')).find(e=>e.textContent.includes(${JSON.stringify(cert)})).open=true`);
 for(const status of ['accepted','received','under_inspection','approved']){
  await admin.wait(`!!document.querySelector('details[open] select[name=status]')`);
  await admin.ev(`{const e=document.querySelector('details[open] select[name=status]'); e.value=${JSON.stringify(status)};e.dispatchEvent(new Event('change',{bubbles:true}));}`);
  await admin.click('Update submission');await admin.wait(`!document.querySelector('details[open] button:disabled')`);await pause(600);
 }
 await admin.fill('details[open] input[name=title]',title);await admin.fill('details[open] input[name=grade]','10');await admin.click('Issue passport');
 await admin.wait(`document.body?.innerText.includes('Passport issued')`);
 console.log('Admin accepted, received, inspected, approved, and issued NFT');
 await admin.click('Record handover');await admin.wait(`document.body?.innerText.includes('Waiting for receipt confirmation')`);
 await a.nav('/submit');await a.wait(`document.body?.innerText.includes(${JSON.stringify(cert)})`);
 await a.ev(`Array.from(document.querySelectorAll('details')).find(e=>e.textContent.includes(${JSON.stringify(cert)})).open=true`);
 await a.ev(`document.querySelector('details[open] input[type=checkbox]').click()`);await a.click('Confirm receipt');await a.wait(`document.body?.innerText.includes('Receipt confirmed by you.')`);
 console.log('Hand-to-hand physical return and owner receipt recorded separately');
 await a.nav('/collection');await a.wait(`document.body?.innerText.includes(${JSON.stringify(title)})`);
 await a.wait(`!!document.querySelector('main a[href^="/items/"]')`);
 const itemHref=await a.ev(`document.querySelector('main a[href^="/items/"]').getAttribute('href')`);
 const itemId=itemHref.split('/').at(-1);
 await a.nav('/verify');await a.wait(`!!document.querySelector('input[name=q]')`);await a.fill('input[name=q]',cert);await a.ev(`document.querySelector('input[name=q]').form.requestSubmit()`);await a.wait(`location.pathname===${JSON.stringify(itemHref)}`);await a.wait(`document.body?.innerText.toLowerCase().includes(${JSON.stringify(walletA.toLowerCase())})`);
 console.log('Collection and Verify resolve issued passport to user A');
 await a.nav('/transfers?item='+itemId);await a.wait(`!!document.querySelector('input[placeholder="0x…"]')`);await a.fill('input[placeholder="0x…"]',walletB);await a.click('Review transfer');
 await a.ev(`window.__originalCredentialGet=navigator.credentials.get.bind(navigator.credentials);navigator.credentials.get=async()=>{throw new DOMException('User cancelled authorization','NotAllowedError')}`);
 await a.click('Confirm transfer');await a.wait(`!!document.querySelector('[role=alert]')`);
 assert(await a.ev(`!Object.keys(localStorage).some(key=>key.startsWith('trueorigin:transfer:') && localStorage.getItem(key)!=='null')`));
 await a.ev(`navigator.credentials.get=window.__originalCredentialGet`);
 console.log('Cancelled passkey authorization leaves no pending transfer and allows retry');
 await a.ev(`window.__originalFetch=window.fetch.bind(window);window.fetch=async(input,init)=>{if(String(input).includes('/api/ethereum/bundler') && String(init?.body).includes('eth_getUserOperationReceipt'))return new Response(JSON.stringify({jsonrpc:'2.0',id:JSON.parse(init.body).id,result:null}),{headers:{'Content-Type':'application/json'}});return window.__originalFetch(input,init)}`);
 await a.click('Confirm transfer');await a.wait(`Object.keys(localStorage).some(key=>key.startsWith('trueorigin:transfer:') && localStorage.getItem(key)!=='null')`);
 await a.nav('/transfers?item='+itemId);await a.wait(`document.body?.innerText.includes('Check confirmation')`);await a.click('Check confirmation');await a.wait(`document.body?.innerText.includes('Transfer confirmed.')`);
 console.log('Reload during pending confirmation recovers the existing operation without resending');
 console.log('User A authorized NFT transfer to user B with browser passkey');
 await b.nav('/collection');await b.wait(`document.body?.innerText.includes(${JSON.stringify(title)})`);
 await a.nav('/collection');await a.wait(`document.body?.innerText.includes('Your objects, together.')`);
 await b.nav(itemHref);await b.wait(`document.body?.innerText.toLowerCase().includes(${JSON.stringify(walletB.toLowerCase())})`);
 await b.nav('/feed');await b.wait(`document.body?.innerText.includes(${JSON.stringify(title)})`);
 await b.nav('/registry');await b.wait(`document.body?.innerText.includes(${JSON.stringify(title)})`);
 console.log('Ownership updated across both Collections, passport, Feed, and Registry');
 await b.ev(`document.querySelector('[data-header-search]').click()`);await b.wait(`!!document.querySelector('[cmdk-input]')`);await b.fill('[cmdk-input]',cert);await b.wait(`!!document.querySelector('[cmdk-item]')`);assert(await b.ev(`document.querySelector('[cmdk-item]').textContent.includes(${JSON.stringify(title)})`));
 console.log('Live search finds public passport by certification number');
 const activity = await b.ev(`fetch('/api/feed').then(r=>r.json())`);
 const ownEvents = activity.events.filter(event => event.itemId === itemId);
 assert.equal(ownEvents.filter(event => event.kind === 'issued').length, 1);
 assert.equal(ownEvents.filter(event => event.kind === 'transfer').length, 1);
 const privateSubmissions = await b.ev(`fetch('/api/submissions').then(r=>r.json())`);
 assert.deepEqual(privateSubmissions, []);
 console.log('Exactly one issuance and one transfer event; recipient cannot read sender submissions');
 console.log(JSON.stringify({itemId,cert,title,walletA,walletB}));
} finally {
 clearTimeout(deadline);
 const stopped = new Promise(resolve => child.once('exit', resolve));
 child.kill();
 await stopped;
 await rm(profile, {recursive: true, force: true, maxRetries: 5, retryDelay: 100});
}
