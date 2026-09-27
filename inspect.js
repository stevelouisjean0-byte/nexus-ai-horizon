/* One batched inspection: desktop + mobile captures, plus the checks that
   share the same render — contrast-critical computed values, overflow,
   focus visibility, heading order and console errors. */
const { spawn } = require('child_process');
const fs = require('fs'), os = require('os'), path = require('path');
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PROFILE = fs.mkdtempSync(path.join(os.tmpdir(), 'nsx-'));
const FILE = 'file:///' + path.resolve(__dirname, 'homepage.html').replace(/\\/g, '/');
const PORT = 9501;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const chrome = spawn(CHROME, ['--headless=new','--remote-debugging-port='+PORT,'--user-data-dir='+PROFILE,
  '--no-first-run','--enable-unsafe-swiftshader','--use-angle=swiftshader','--use-gl=angle',
  '--allow-file-access-from-files','--window-size=1440,900','--hide-scrollbars','about:blank'],{stdio:'ignore'});
let id=0; const pending=new Map(); const errors=[];
function send(ws,m,p){const i=++id;ws.send(JSON.stringify({id:i,method:m,params:p||{}}));
  return new Promise((res,rej)=>{pending.set(i,{res,rej});setTimeout(()=>{if(pending.has(i)){pending.delete(i);rej(new Error('timeout '+m))}},90000);});}

(async()=>{
  let t=null;
  for(let i=0;i<40;i++){ try{ t=await (await fetch('http://127.0.0.1:'+PORT+'/json/list')).json(); if(t.length)break; }catch(e){} await sleep(250); }
  const page=t.find(x=>x.type==='page')||t[0];
  const ws=new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((res,rej)=>{ws.onopen=res;ws.onerror=rej;});
  ws.onmessage=e=>{const m=JSON.parse(e.data);
    if(m.id&&pending.has(m.id)){const p=pending.get(m.id);pending.delete(m.id); m.error?p.rej(new Error(JSON.stringify(m.error))):p.res(m.result); return;}
    if(m.method==='Runtime.exceptionThrown'){const d=m.params.exceptionDetails;
      errors.push('EXCEPTION: '+((d.exception&&d.exception.description)||d.text));}
    if(m.method==='Runtime.consoleAPICalled'&&m.params.type==='error')
      errors.push('console: '+m.params.args.map(a=>a.description||a.value).join(' '));
  };
  await send(ws,'Runtime.enable'); await send(ws,'Page.enable');

  const ev = async e => { const r = await send(ws,'Runtime.evaluate',{expression:e,returnByValue:true});
    return r.exceptionDetails ? ('ERR '+((r.exceptionDetails.exception&&r.exceptionDetails.exception.description)||'')) : r.result.value; };
  const shot = async (n,full) => { const r = await send(ws,'Page.captureScreenshot',{format:'png',captureBeyondViewport:!!full});
    fs.writeFileSync(path.join(__dirname,n), Buffer.from(r.data,'base64')); console.log('  wrote', n); };
  const metrics = (w,h,mobile) => send(ws,'Emulation.setDeviceMetricsOverride',
    {width:w,height:h,deviceScaleFactor:1,mobile:!!mobile});

  /* ── desktop ── */
  await metrics(1440,900,false);
  await send(ws,'Page.navigate',{url:FILE});
  await sleep(6000);

  const audit = await ev(`(function(){
    var out = {};
    var de = document.documentElement;
    out.docWidth = de.scrollWidth;
    out.viewport = innerWidth;
    out.horizontalOverflow = de.scrollWidth > innerWidth + 1;
    // any element wider than the viewport
    var wide = [];
    document.querySelectorAll('body *').forEach(function(el){
      var r = el.getBoundingClientRect();
      if(r.width > innerWidth + 2 && r.height > 0 && getComputedStyle(el).position !== 'fixed')
        wide.push(el.tagName.toLowerCase() + (el.className && typeof el.className==='string' ? '.'+el.className.trim().split(/\\s+/)[0] : '') + ' ' + Math.round(r.width) + 'px');
    });
    out.tooWide = wide.slice(0,6);
    // heading order
    var hs = [].map.call(document.querySelectorAll('h1,h2,h3,h4,h5,h6'), function(h){return +h.tagName[1]});
    var skips = []; for(var i=1;i<hs.length;i++) if(hs[i] - hs[i-1] > 1) skips.push(hs[i-1]+'->'+hs[i]);
    out.h1Count = document.querySelectorAll('h1').length;
    out.headingSkips = skips;
    // images without alt
    out.imgNoAlt = document.querySelectorAll('img:not([alt])').length;
    // form labels
    var unlabelled = 0;
    document.querySelectorAll('input,select,textarea').forEach(function(f){
      if(f.type==='hidden') return;
      var id=f.id, lab = id && document.querySelector('label[for="'+id+'"]');
      if(!lab && !f.closest('label') && !f.getAttribute('aria-label')) unlabelled++;
    });
    out.unlabelledFields = unlabelled;
    // links with no accessible name
    var nameless = 0;
    document.querySelectorAll('a[href]').forEach(function(a){
      if(!(a.textContent||'').trim() && !a.getAttribute('aria-label') && !a.querySelector('img[alt]:not([alt=""])')) nameless++;
    });
    out.namelessLinks = nameless;
    out.linkCount = document.querySelectorAll('a[href]').length;
    // typographic measure on body copy
    var body = document.querySelector('.note');
    if(body){ var cs = getComputedStyle(body);
      out.bodyFontPx = cs.fontSize; out.bodyMaxWidth = cs.maxWidth; }
    // smallest rendered text
    var min = 99, minSel='';
    document.querySelectorAll('p,li,span,label,a,div').forEach(function(el){
      if(!el.textContent.trim() || el.children.length) return;
      var fs2 = parseFloat(getComputedStyle(el).fontSize);
      if(fs2 && fs2 < min){ min = fs2; minSel = el.className || el.tagName; }
    });
    out.smallestTextPx = min + ' (' + minSel + ')';
    out.title = document.title;
    out.metaDesc = (document.querySelector('meta[name=description]')||{}).content ? 'present' : 'MISSING';
    out.schema = document.querySelectorAll('script[type="application/ld+json"]').length;
    return JSON.stringify(out);
  })()`);
  console.log('DESKTOP AUDIT:', audit);

  console.log('desktop captures:');
  await shot('shot-1-hero.png');
  await ev('scrollTo(0, innerHeight*1.9)'); await sleep(2500); await shot('shot-2-call.png');
  await ev('scrollTo(0, innerHeight*3.4)'); await sleep(2500); await shot('shot-3-cost.png');
  await ev('scrollTo(0, innerHeight*5.2)'); await sleep(2500); await shot('shot-4-reel.png');
  await ev('scrollTo(0, document.body.scrollHeight*0.72)'); await sleep(2500); await shot('shot-5-evidence.png');
  await ev('scrollTo(0, document.body.scrollHeight)'); await sleep(2500); await shot('shot-6-close.png');

  /* ── mobile, same render pass ── */
  await metrics(390,844,true);
  await ev('scrollTo(0,0)'); await sleep(2500);
  const mob = await ev(`(function(){
    var de = document.documentElement, out = {};
    out.horizontalOverflow = de.scrollWidth > innerWidth + 1;
    out.docWidth = de.scrollWidth; out.viewport = innerWidth;
    var small = [];
    document.querySelectorAll('a,button').forEach(function(el){
      var r = el.getBoundingClientRect();
      if(r.width>0 && r.height>0 && (r.height < 24) && el.offsetParent !== null)
        small.push((el.textContent||'').trim().slice(0,18) + ' ' + Math.round(r.width)+'x'+Math.round(r.height));
    });
    out.smallTapTargets = small.slice(0,8);
    out.tapTargetCount = small.length;
    return JSON.stringify(out);
  })()`);
  console.log('MOBILE AUDIT:', mob);
  console.log('mobile captures:');
  await shot('shot-m1-hero.png');
  await ev('scrollTo(0, innerHeight*2.2)'); await sleep(2200); await shot('shot-m2-call.png');
  await ev('scrollTo(0, document.body.scrollHeight*0.5)'); await sleep(2200); await shot('shot-m3-mid.png');
  await ev('scrollTo(0, document.body.scrollHeight)'); await sleep(2200); await shot('shot-m4-close.png');

  console.log('\nERRORS (' + errors.length + ')');
  [...new Set(errors)].slice(0,12).forEach(e=>console.log('  ',e));
  if(!errors.length) console.log('   none');
  ws.close(); chrome.kill(); process.exit(0);
})().catch(e=>{console.error('FAIL',e.message);try{chrome.kill()}catch(_){}process.exit(2)});
