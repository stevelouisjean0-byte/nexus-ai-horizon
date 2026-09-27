/* Loads homepage.html inside a sandboxed iframe, the way the artifact host
   embeds it, and measures how much of the page is actually visible. */
const { spawn } = require('child_process');
const fs = require('fs'), os = require('os'), path = require('path');
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PROFILE = fs.mkdtempSync(path.join(os.tmpdir(), 'nsxf-'));
const PORT = 9503;
const sleep = ms => new Promise(r => setTimeout(r, ms));

const HOST = path.join(__dirname, '_frame_host.html');
fs.writeFileSync(HOST, `<!doctype html><meta charset="utf-8">
<style>html,body{margin:0;height:100%;background:#111}
iframe{width:100vw;height:100vh;border:0;display:block}</style>
<iframe id="f" sandbox="allow-scripts allow-forms allow-popups allow-modals"
        src="homepage.html"></iframe>`);

let id=0; const pending=new Map(); const errs=[];
function send(ws,m,p){const i=++id;ws.send(JSON.stringify({id:i,method:m,params:p||{}}));
  return new Promise((res,rej)=>{pending.set(i,{res,rej});setTimeout(()=>{if(pending.has(i)){pending.delete(i);rej(new Error('timeout '+m))}},60000);});}

const chrome = spawn(CHROME, ['--headless=new','--remote-debugging-port='+PORT,'--user-data-dir='+PROFILE,
  '--no-first-run','--enable-unsafe-swiftshader','--use-angle=swiftshader','--use-gl=angle',
  '--allow-file-access-from-files','--window-size=1440,900','--hide-scrollbars','about:blank'],{stdio:'ignore'});

(async()=>{
  let t=null;
  for(let i=0;i<40;i++){ try{ t=await (await fetch('http://127.0.0.1:'+PORT+'/json/list')).json(); if(t.length)break; }catch(e){} await sleep(250); }
  const page=t.find(x=>x.type==='page')||t[0];
  const ws=new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((r,j)=>{ws.onopen=r;ws.onerror=j;});
  ws.onmessage=e=>{const m=JSON.parse(e.data);
    if(m.id&&pending.has(m.id)){const p=pending.get(m.id);pending.delete(m.id); m.error?p.rej(new Error(JSON.stringify(m.error))):p.res(m.result); return;}
    if(m.method==='Runtime.exceptionThrown') errs.push('EXC: '+((m.params.exceptionDetails.exception||{}).description||m.params.exceptionDetails.text));
  };
  await send(ws,'Runtime.enable'); await send(ws,'Page.enable');
  await send(ws,'Page.navigate',{url:'file:///'+HOST.replace(/\\/g,'/')});
  await sleep(9000);

  // target the iframe's own execution context
  const targets = await (await fetch('http://127.0.0.1:'+PORT+'/json/list')).json();
  const frame = targets.find(x => x.url.includes('homepage.html'));
  let ws2 = ws, prefix = '';
  if(frame){
    ws2 = new WebSocket(frame.webSocketDebuggerUrl);
    await new Promise((r,j)=>{ws2.onopen=r;ws2.onerror=j;});
    ws2.onmessage = ws.onmessage;
    await send(ws2,'Runtime.enable');
    console.log('(measuring inside the iframe context)');
  } else {
    prefix = 'document.getElementById("f").contentWindow.';
    console.log('(same-process frame; measuring via contentWindow)');
  }
  const ev = async e => { const r = await send(ws2,'Runtime.evaluate',{expression:e,returnByValue:true});
    return r.exceptionDetails ? ('ERR '+((r.exceptionDetails.exception&&r.exceptionDetails.exception.description)||'')) : r.result.value; };

  const report = await ev(`(function(){
    var SEL = '.chap .in, .shd, .statement, .srow, .env, .drow, .tri>div, .dossier, .aftr, form, .bignum, .dials, .memo';
    var els = [].slice.call(document.querySelectorAll(SEL));
    var hidden = els.filter(function(el){ return +getComputedStyle(el).opacity < 0.05; });
    var h1 = document.querySelector('.hero h1 .l>span');
    return JSON.stringify({
      revealTargets: els.length,
      stillHidden: hidden.length,
      pctHidden: els.length ? Math.round(hidden.length/els.length*100) : 0,
      h1Transform: h1 ? getComputedStyle(h1).transform : 'n/a',
      gsap: typeof window.gsap,
      scrollTrigger: typeof window.ScrollTrigger,
      docHeight: document.documentElement.scrollHeight,
      firstHidden: hidden.slice(0,3).map(function(e){return e.className.split(' ')[0]})
    }, null, 1);
  })()`);
  console.log('IN-FRAME REPORT:', report);

  const shot = await send(ws,'Page.captureScreenshot',{format:'png'});
  fs.writeFileSync(path.join(__dirname,'shot-frame-top.png'), Buffer.from(shot.data,'base64'));
  console.log('wrote shot-frame-top.png');

  await ev('scrollTo(0, document.documentElement.scrollHeight*0.45)');
  await sleep(2500);
  const shot2 = await send(ws,'Page.captureScreenshot',{format:'png'});
  fs.writeFileSync(path.join(__dirname,'shot-frame-mid.png'), Buffer.from(shot2.data,'base64'));
  console.log('wrote shot-frame-mid.png');

  const after = await ev(`(function(){
    var SEL = '.chap .in, .shd, .statement, .srow, .env, .drow, .tri>div, .dossier, .aftr, form, .bignum, .dials, .memo';
    var els = [].slice.call(document.querySelectorAll(SEL));
    var hidden = els.filter(function(el){ return +getComputedStyle(el).opacity < 0.05; });
    return 'after scroll — still hidden: ' + hidden.length + ' of ' + els.length;
  })()`);
  console.log(after);

  console.log('errors:', errs.length ? [...new Set(errs)].slice(0,5) : 'none');
  try{ fs.unlinkSync(HOST); }catch(e){}
  chrome.kill(); process.exit(0);
})().catch(e=>{console.error('FAIL',e.message);try{chrome.kill()}catch(_){}process.exit(2)});
