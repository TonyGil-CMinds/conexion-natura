const { spawn } = require('child_process');
const fs = require('fs'); const path = require('path');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 9342; const OUT = path.join(process.env.TEMP, 'shot-quito');
fs.mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const chrome = spawn(CHROME, ['--headless=new','--disable-gpu','--no-first-run','--hide-scrollbars',
    `--remote-debugging-port=${PORT}`, `--user-data-dir=${path.join(OUT,'p')}`, 'about:blank'], { stdio: 'ignore' });
  let wsUrl;
  for (let i = 0; i < 60 && !wsUrl; i++) {
    try { wsUrl = (await (await fetch(`http://127.0.0.1:${PORT}/json/version`)).json()).webSocketDebuggerUrl; } catch {}
    if (!wsUrl) await sleep(250);
  }
  const ws = new WebSocket(wsUrl); let id = 0; const pending = new Map();
  const send = (m, p = {}, s) => new Promise((res) => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method: m, params: p, sessionId: s })); });
  await new Promise((r) => ws.addEventListener('open', r));
  ws.addEventListener('message', (ev) => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); } });
  const t = (await send('Target.getTargets')).targetInfos.find((x) => x.type === 'page');
  const { sessionId } = await send('Target.attachToTarget', { targetId: t.targetId, flatten: true });
  await send('Page.enable', {}, sessionId); await send('Runtime.enable', {}, sessionId);
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false }, sessionId);
  await send('Page.navigate', { url: 'http://localhost:3117/es/quito' }, sessionId);
  await sleep(4000);
  await send('Runtime.evaluate', { expression: "document.querySelector('ul[data-group]').closest('section').scrollIntoView({block:'center'})" }, sessionId);
  await sleep(2500);
  const shot = await send('Page.captureScreenshot', { format: 'png' }, sessionId);
  const f = path.join(OUT, 'socios-1440.png');
  fs.writeFileSync(f, Buffer.from(shot.data, 'base64'));
  console.log(f);
  ws.close(); chrome.kill();
})();
