/**
 * Captura la página en instantes concretos, para revisar animaciones cuadro a cuadro.
 *
 *   node scripts/capture.js http://localhost:3000 ./tmp 800,3000,4400,6500 1280x832
 *
 * Va por CDP y espera en tiempo real a propósito. El modo simple de Chrome
 * (--screenshot --virtual-time-budget) no sirve aquí: el tiempo virtual solo
 * avanza cuando la página queda inactiva, y con GSAP y la secuencia corriendo
 * nunca lo está, así que los porcentajes que captura no son los reales.
 *
 * Con un quinto argumento (selector CSS) toma además una segunda captura con el
 * puntero encima de ese elemento, para revisar estados :hover.
 *
 * Imprime además la consola de la página, incluidas las excepciones.
 */
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const [url, outDir, timesArg, sizeArg, hoverSelector] = process.argv.slice(2);
const [VW, VH] = (sizeArg || '1280x832').split('x').map(Number);
const times = timesArg.split(',').map(Number).sort((a, b) => a - b);
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 9333;

const chrome = spawn(CHROME, [
  '--headless=new',
  '--disable-gpu',
  '--no-first-run',
  '--no-default-browser-check',
  '--hide-scrollbars',
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${path.join(outDir, 'cdp-profile')}`,
  `--window-size=${VW},${VH}`,
  'about:blank',
], { stdio: 'ignore' });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getWsUrl() {
  for (let i = 0; i < 40; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/version`);
      const json = await res.json();
      if (json.webSocketDebuggerUrl) return json.webSocketDebuggerUrl;
    } catch {}
    await sleep(250);
  }
  throw new Error('no se pudo conectar a Chrome');
}

(async () => {
  const wsUrl = await getWsUrl();
  const ws = new WebSocket(wsUrl);
  let id = 0;
  const pending = new Map();
  const logs = [];

  const send = (method, params = {}, sessionId) =>
    new Promise((resolve) => {
      const msgId = ++id;
      pending.set(msgId, resolve);
      ws.send(JSON.stringify({ id: msgId, method, params, sessionId }));
    });

  await new Promise((r) => ws.addEventListener('open', r));

  let sessionId = null;
  ws.addEventListener('message', (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg.result);
      pending.delete(msg.id);
      return;
    }
    if (msg.method === 'Runtime.consoleAPICalled') {
      logs.push(`console.${msg.params.type}: ` +
        msg.params.args.map((a) => a.value ?? a.description ?? a.type).join(' '));
    }
    if (msg.method === 'Runtime.exceptionThrown') {
      logs.push('EXCEPTION: ' + JSON.stringify(msg.params.exceptionDetails.text) + ' ' +
        (msg.params.exceptionDetails.exception?.description || ''));
    }
    if (msg.method === 'Log.entryAdded' && msg.params.entry.level === 'error') {
      logs.push('LOG error: ' + msg.params.entry.text);
    }
  });

  const targets = await send('Target.getTargets');
  const page = targets.targetInfos.find((t) => t.type === 'page');
  ({ sessionId } = await send('Target.attachToTarget', { targetId: page.targetId, flatten: true }));

  await send('Page.enable', {}, sessionId);
  await send('Runtime.enable', {}, sessionId);
  await send('Log.enable', {}, sessionId);
  await send('Emulation.setDeviceMetricsOverride',
    { width: VW, height: VH, deviceScaleFactor: 1, mobile: VW < 700 }, sessionId);

  const shoot = async (name) => {
    const shot = await send('Page.captureScreenshot', { format: 'png' }, sessionId);
    const file = path.join(outDir, name);
    fs.writeFileSync(file, Buffer.from(shot.data, 'base64'));
    console.log(`  -> ${name} (${fs.statSync(file).size} bytes)`);
  };

  const t0 = Date.now();
  await send('Page.navigate', { url }, sessionId);

  for (const t of times) {
    const wait = t - (Date.now() - t0);
    if (wait > 0) await sleep(wait);
    await shoot(`rt-${VW}-${t}.png`, t);

    if (hoverSelector) {
      const box = await send('Runtime.evaluate', {
        expression: `(() => {
          const el = document.querySelector(${JSON.stringify(hoverSelector)});
          if (!el) return null;
          const r = el.getBoundingClientRect();
          return JSON.stringify({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
        })()`,
        returnByValue: true,
      }, sessionId);

      const target = box.result.value ? JSON.parse(box.result.value) : null;
      if (!target) {
        console.log(`  hover: no se encontró ${hoverSelector}`);
      } else {
        // Un mouseMoved real es lo único que activa :hover; forzarlo por clase
        // probaría otra cosa distinta de lo que hace el navegador.
        await send('Input.dispatchMouseEvent',
          { type: 'mouseMoved', x: target.x, y: target.y, buttons: 0 }, sessionId);
        await sleep(500);
        await shoot(`rt-${VW}-${t}-hover.png`, t);
        await send('Input.dispatchMouseEvent',
          { type: 'mouseMoved', x: 5, y: 5, buttons: 0 }, sessionId);
        await sleep(400);
      }
    }
  }

  console.log(logs.length ? '\n--- consola ---\n' + logs.join('\n') : '\n--- consola limpia ---');
  ws.close();
  chrome.kill();
  process.exit(0);
})().catch((err) => {
  console.error(err);
  chrome.kill();
  process.exit(1);
});
