const { spawn } = require('child_process');
const fs = require('fs'); const path = require('path');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 9347; const OUT = path.join(process.env.TEMP, 'shot-quito2');
fs.mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const EXPR = [
  '(() => {',
  "  const out = [...document.querySelectorAll('ul[data-group]')].map((ul) => {",
  '    const li = [...ul.children].map((x) => x.getBoundingClientRect());',
  '    const tops = new Set(li.map((r) => Math.round(r.top)));',
  "    const vis = [...ul.querySelectorAll('img')].filter((i) => getComputedStyle(i).display !== 'none');",
  "    const h3 = ul.parentElement.querySelector('h3');",
  '    const cs = h3 ? getComputedStyle(h3) : null;',
  "    const bid = vis.find((i) => i.alt === 'BID Lab' || i.getAttribute('alt') === '');",
  '    return {',
  '      grupo: ul.dataset.group, lineas: tops.size,',
  '      ancho: Math.round(ul.getBoundingClientRect().width),',
  '      alto: Math.round(vis[0].getBoundingClientRect().height),',
  "      rotulo: h3 ? h3.textContent : '(ninguno)',",
  "      rotuloPx: cs ? cs.fontSize : '-', rotuloOp: cs ? cs.opacity : '-', rotuloColor: cs ? cs.color : '-',",
  '      anchos: vis.map((i) => Math.round(i.getBoundingClientRect().width)),',
  '    };',
  '  });',
  '  return JSON.stringify(out);',
  '})()',
].join('\n');
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
  for (const w of [1600, 1440, 1280, 1024, 900, 390]) {
    await send('Emulation.setDeviceMetricsOverride', { width: w, height: 1000, deviceScaleFactor: 1, mobile: w < 700 }, sessionId);
    await send('Page.navigate', { url: 'http://localhost:3119/es/quito' }, sessionId);
    await sleep(3500);
    await send('Runtime.evaluate', { expression: "document.querySelector('ul[data-group]').closest('section').scrollIntoView({block:'center'})" }, sessionId);
    await sleep(2200);
    const r = await send('Runtime.evaluate', { expression: EXPR, returnByValue: true }, sessionId);
    console.log(`\n=== ${w}px ===`);
    for (const g of JSON.parse(r.result.value)) {
      console.log(`  ${g.grupo.padEnd(8)} ${g.lineas} linea | ancho ${String(g.ancho).padStart(4)} | alto ${String(g.alto).padStart(2)}px | anchos: ${g.anchos.join(',')}`);
      if (g.rotulo !== '(ninguno)') console.log(`           rotulo "${g.rotulo}" ${g.rotuloPx} opacidad ${g.rotuloOp} color ${g.rotuloColor}`);
    }
    if (w === 1440) {
      const shot = await send('Page.captureScreenshot', { format: 'png' }, sessionId);
      fs.writeFileSync(path.join(OUT, 'socios.png'), Buffer.from(shot.data, 'base64'));
      console.log('  -> ' + path.join(OUT, 'socios.png'));
    }
  }
  ws.close(); chrome.kill();
})();
