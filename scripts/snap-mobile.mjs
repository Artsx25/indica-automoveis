import fs from 'fs';
import { getChromePage, evaluate, sendCdpCommand, navigate } from './cdp-helper.mjs';

async function snap() {
  const page = await getChromePage();
  const ws = page.webSocketDebuggerUrl;

  await sendCdpCommand(ws, 'Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });

  await navigate(ws, 'http://localhost:5173/veiculo/jeep-compass-limited-t270-turbo-2022');
  await new Promise(r => setTimeout(r, 1500));

  const res = await sendCdpCommand(ws, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('mobile_page_view.png', Buffer.from(res.data, 'base64'));
  console.log('Saved mobile_page_view.png');
}

snap().catch(console.error);
