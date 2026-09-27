// Generate the chapter clip with ByteDance Seedance 2.5 (image to video, 720p)
// through the RunComfy Model API, without the RunComfy CLI (which does not
// install on Windows). Needs RUNCOMFY_TOKEN in the environment.
//
//   RUNCOMFY_TOKEN=... node make-video.cjs [seconds]
//
// Cost is $0.35 per generated second (8 s = $2.80). The output aspect ratio
// follows the input image (the Bay Ridge still, 3:2). Audio is off.
const fs = require('fs');
const path = require('path');
const https = require('https');

const TOKEN = process.env.RUNCOMFY_TOKEN;
if (!TOKEN) { console.error('RUNCOMFY_TOKEN is not set. Get a token from your RunComfy account and rerun.'); process.exit(77); }
const seconds = Math.max(4, Math.min(30, parseInt(process.argv[2] || '8', 10)));
const MODEL = 'bytedance/seedance-2.5/image-to-video/720p';
const IMAGE = 'https://images.pexels.com/photos/7180335/pexels-photo-7180335.jpeg?auto=compress&cs=tinysrgb&w=1600';
const PROMPT = 'A quiet Brooklyn avenue in bright daylight. A few thin clouds drift slowly across the clear sky; the traffic light cycles once; one car rolls down the avenue toward the bridge and a second passes the other way; leaves on the sidewalk trees stir in a light breeze. Locked-off tripod, no camera movement, steady daylight, no people added, no text, no watermark, no on-screen captions.';
const OUT = path.join(__dirname, 'assets');

function req(method, url, body, headers) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const data = body ? JSON.stringify(body) : null;
    const r = https.request({ method, hostname: u.hostname, path: u.pathname + u.search, headers: Object.assign({ Authorization: 'Bearer ' + TOKEN, Accept: 'application/json' }, data ? { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) } : {}, headers || {}) }, (res) => {
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => {
        const buf = Buffer.concat(chunks);
        if (res.headers['content-type'] && res.headers['content-type'].includes('json')) {
          try { resolve({ status: res.statusCode, json: JSON.parse(buf.toString('utf8')) }); } catch (e) { resolve({ status: res.statusCode, text: buf.toString('utf8') }); }
        } else resolve({ status: res.statusCode, buf });
      });
    });
    r.on('error', reject);
    if (data) r.write(data);
    r.end();
  });
}
function download(url, file) {
  return new Promise((resolve, reject) => {
    const go = (u, n) => {
      https.get(u, (res) => {
        if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location && n < 5) return go(res.headers.location, n + 1);
        if (res.statusCode !== 200) return reject(new Error('download ' + res.statusCode));
        const ws = fs.createWriteStream(file);
        res.pipe(ws);
        ws.on('finish', () => resolve(fs.statSync(file).size));
      }).on('error', reject);
    };
    go(url, 0);
  });
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  console.log(`Submitting ${seconds}s clip to ${MODEL} (about $${(seconds * 0.35).toFixed(2)})`);
  const sub = await req('POST', 'https://model-api.runcomfy.net/v1/models/' + MODEL, { prompt: PROMPT, image: IMAGE, duration: seconds, generate_audio: false });
  console.log('submit', sub.status, JSON.stringify(sub.json || sub.text).slice(0, 300));
  if (sub.status >= 400 || !sub.json) process.exit(sub.status === 401 || sub.status === 403 ? 77 : 69);
  const id = sub.json.request_id || sub.json.id || (sub.json.data && sub.json.data.request_id);
  if (!id) { console.error('no request id in response'); process.exit(69); }
  let result = null;
  for (let i = 0; i < 240; i++) {
    await sleep(5000);
    const st = await req('GET', `https://model-api.runcomfy.net/v1/requests/${id}/status`);
    const s = st.json ? (st.json.status || (st.json.data && st.json.data.status)) : st.status;
    process.stdout.write(`\r${i * 5}s status: ${s}      `);
    if (s === 'completed' || s === 'succeeded' || s === 'success') { result = await req('GET', `https://model-api.runcomfy.net/v1/requests/${id}/result`); break; }
    if (s === 'failed' || s === 'error' || s === 'cancelled') { console.error('\njob ' + s, JSON.stringify(st.json)); process.exit(69); }
  }
  if (!result) { console.error('\ntimed out'); process.exit(75); }
  console.log('\nresult', JSON.stringify(result.json).slice(0, 600));
  const text = JSON.stringify(result.json);
  const urls = [...new Set(text.match(/https:\/\/[^"\\\s]+runcomfy\.(?:net|com)[^"\\\s]*/g) || [])];
  const mp4 = urls.find((u) => /\.mp4/i.test(u)) || urls[0];
  if (!mp4) { console.error('no output url found'); process.exit(69); }
  fs.mkdirSync(OUT, { recursive: true });
  const file = path.join(OUT, 'street-timelapse.mp4');
  const size = await download(mp4, file);
  console.log('saved', file, size, 'bytes');
  fs.writeFileSync(path.join(OUT, 'street-timelapse.json'), JSON.stringify({ model: MODEL, seconds, prompt: PROMPT, image: IMAGE, request_id: id, output: mp4, saved: new Date().toISOString() }, null, 2));
})().catch((e) => { console.error('ERR', e.message); process.exit(69); });
