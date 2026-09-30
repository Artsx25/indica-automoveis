import fs from 'fs';

export async function getChromePage() {
  const pages = await (await fetch('http://127.0.0.1:9222/json')).json();
  const page = pages.find(p => p.type === 'page' && (p.url.includes('instagram.com') || p.url.includes('localhost') || p.url.includes('newtab')));
  if (!page) throw new Error('No Chrome page found');
  return page;
}

export function sendCdpCommand(wsUrl, method, params = {}) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl);
    const id = Math.floor(Math.random() * 100000);

    const timeout = setTimeout(() => {
      ws.close();
      reject(new Error(`Timeout waiting for CDP response (${method})`));
    }, 15000);

    ws.onopen = () => {
      ws.send(JSON.stringify({ id, method, params }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.id === id) {
        clearTimeout(timeout);
        ws.close();
        if (data.error) reject(new Error(data.error.message));
        else resolve(data.result);
      }
    };

    ws.onerror = (err) => {
      clearTimeout(timeout);
      reject(err);
    };
  });
}

export async function evaluate(wsUrl, expression) {
  const res = await sendCdpCommand(wsUrl, 'Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  return res?.result?.value;
}

export async function navigate(wsUrl, url) {
  await sendCdpCommand(wsUrl, 'Page.navigate', { url });
  // Wait a bit
  await new Promise(r => setTimeout(r, 3000));
}

async function test() {
  const page = await getChromePage();
  console.log('Using page:', page.url);
  const title = await evaluate(page.webSocketDebuggerUrl, 'document.title');
  console.log('Title in browser:', title);
}

if (process.argv[1]?.endsWith('cdp-helper.mjs')) {
  test().catch(console.error);
}
