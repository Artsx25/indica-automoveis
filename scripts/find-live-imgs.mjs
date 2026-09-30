import { getChromePage, evaluate } from './cdp-helper.mjs';

async function findImgs() {
  const page = await getChromePage();
  const wsUrl = page.webSocketDebuggerUrl;

  const script = `
    (() => {
      const allImgs = Array.from(document.querySelectorAll('img')).map(img => ({
        src: img.src,
        className: img.className,
        alt: img.alt,
        width: img.naturalWidth || img.width,
        height: img.naturalHeight || img.height
      })).filter(img => img.src && (img.src.includes('cdninstagram') || img.src.includes('scontent')) && !img.src.includes('profile_pic') && !img.src.includes('rsrc.php'));

      return allImgs;
    })()
  `;

  const data = await evaluate(wsUrl, script);
  console.log('Vehicle images found:', data.length);
  data.forEach((img, i) => console.log(`[${i}] ${img.width}x${img.height} | ${img.src}`));
}

findImgs().catch(console.error);
