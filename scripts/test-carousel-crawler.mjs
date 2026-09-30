import { getChromePage, evaluate } from './cdp-helper.mjs';
import fs from 'fs';
import path from 'path';

async function crawlCurrentCarousel(slug) {
  const page = await getChromePage();
  const wsUrl = page.webSocketDebuggerUrl;

  console.log('Crawling carousel for:', slug);
  const collectedUrls = [];

  for (let step = 0; step < 12; step++) {
    const script = `
      (() => {
        // Find visible car image (must be large, not profile pic)
        const imgs = Array.from(document.querySelectorAll('img'))
          .filter(img => {
            const w = img.naturalWidth || img.width;
            const h = img.naturalHeight || img.height;
            return w > 300 && h > 300 && !img.src.includes('profile_pic') && !img.src.includes('rsrc.php');
          })
          .map(img => img.src);

        // Click next button if available
        const nextBtn = document.querySelector('button[aria-label="Next"], button[aria-label="Avançar"], button[aria-label="Próximo"], button[aria-label="_af37"]');
        let clicked = false;
        if (nextBtn) {
          nextBtn.click();
          clicked = true;
        }

        return { imgs, clicked };
      })()
    `;

    const res = await evaluate(wsUrl, script);
    if (res?.imgs) {
      for (const u of res.imgs) {
        if (!collectedUrls.includes(u)) {
          collectedUrls.push(u);
          console.log(`Found photo ${collectedUrls.length}:`, u.substring(0, 100));
        }
      }
    }

    if (!res?.clicked) {
      console.log('No more next button or reached end of carousel.');
      break;
    }

    // Wait for animation and next image load
    await new Promise(r => setTimeout(r, 1200));
  }

  console.log(`Total photos collected for ${slug}:`, collectedUrls.length);

  // Download them
  const dir = path.join(process.cwd(), 'public', 'images', 'vehicles', slug);
  fs.mkdirSync(dir, { recursive: true });

  const savedPaths = [];
  for (let i = 0; i < collectedUrls.length; i++) {
    const url = collectedUrls[i];
    const num = String(i + 1).padStart(2, '0');
    const dest = path.join(dir, `img_${num}.jpg`);
    try {
      const resp = await fetch(url);
      const buf = Buffer.from(await resp.arrayBuffer());
      fs.writeFileSync(dest, buf);
      savedPaths.push(`/images/vehicles/${slug}/img_${num}.jpg`);
      console.log(`Saved ${dest} (${buf.length} bytes)`);
    } catch (err) {
      console.error(`Error saving photo ${i + 1}:`, err.message);
    }
  }

  return savedPaths;
}

crawlCurrentCarousel('renault-kangoo-expression-1-6-flex-2013').catch(console.error);
