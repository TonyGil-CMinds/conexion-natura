const { spawn } = require('child_process');
const path = require('path');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 9341;
const OUT = path.join(process.env.TEMP, 'medir-quito');
require('fs').mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const EXPR = `(() => {
  const rows = [...document.querySelectorAll('ul[data-group]')];
  return JSON.stringify(rows.map((ul) => {
    const li = [...ul.children].map((x) => x.getBoundingClientRect());
    const tops = new Set(li.map((r) => Math.round(r.top)));
    const h3 = ul.parentElement.querySelector('h3');
    return {
      grupo: ul.dataset.group,
      rotulo: h3 ? h3.textContent : '(ninguno)',
      logos: li.length,
      lineas: tops.size,
      ancho: Math.round(ul.getBoundingClientRect().width),
      visible: li.length ? li.every((r) => r.width > 0 && r.height > 0) : false,
    };
  }));
})()`;

(async () => {
  const chrome = spawn(CHROME, ['--headless=new','--disable-gpu','--no-first-run','--hide-scrollbars',
    `--remote-debugging-port=${PORT}`, `--user-data-dir=${path.join(OUT,'p')}`, 'about:blank'], { stdio: 'ignore' });

  let wsUrl;
  for (let i = 0; i < 60 && !wsUrl; i++) {
    try { wsUrl = (await (await fetch(`http://127.0.0.1:${PORT}/json/version`)).json()).webSocketDebuggerUrl; } catch {}
    if (!wsUrl) await sleep(250);
  }
  const ws = new WebSocket(wsUrl);
  let id = 0; const pending = new Map();
  const send = (method, params = {}, sessionId) => new Promise((res) => {
    const m = ++id; pending.set(m, res); ws.send(JSON.stringify({ id: m, method, params, sessionId }));
  });
  await new Promise((r) => ws.addEventListener('open', r));
  ws.addEventListener('message', (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg.result); pending.delete(msg.id); }
  });
  const t = (await send('Target.getTargets')).targetInfos.find((x) => x.type === 'page');
  const { sessionId } = await send('Target.attachToTarget', { targetId: t.targetId, flatten: true });
  await send('Page.enable', {}, sessionId);
  await send('Runtime.enable', {}, sessionId);

  for (const w of [1600, 1440, 1280, 1024, 900, 780, 390]) {
    await send('Emulation.setDeviceMetricsOverride', { width: w, height: 1000, deviceScaleFactor: 1, mobile: w < 700 }, sessionId);
    await send('Page.navigate', { url: 'http://localhost:3117/es/quito' }, sessionId);
    await sleep(3500);
    await send('Runtime.evaluate', { expression: 'window.scrollTo(0, document.body.scrollHeight)' }, sessionId);
    await sleep(2500);
    const r = await send('Runtime.evaluate', { expression: EXPR, returnByValue: true }, sessionId);
    console.log(`\n=== ${w}px ===`);
    for (const g of JSON.parse(r.result.value)) {
      console.log(`  ${g.grupo.padEnd(8)} ${String(g.logos).padStart(2)} logos | ${g.lineas} línea(s) | ancho ${String(g.ancho).padStart(4)} | ${g.visible ? 'todos visibles' : '⚠ alguno con caja 0'} | "${g.rotulo}"`);
    }
  }
  ws.close(); chrome.kill();
})();
