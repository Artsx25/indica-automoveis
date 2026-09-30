import { getChromePage, evaluate } from './cdp-helper.mjs';

async function inspectCarousel() {
  const page = await getChromePage();
  const wsUrl = page.webSocketDebuggerUrl;

  const script = `
    (() => {
      // Find all images currently visible
      const imgs = Array.from(document.querySelectorAll('article img')).map(img => ({
        src: img.src,
        srcset: img.srcset,
        alt: img.alt,
        width: img.naturalWidth || img.width,
        height: img.naturalHeight || img.height
      }));

      // Check next buttons
      const nextBtn = document.querySelector('button[aria-label="Next"], button[aria-label="Avançar"], button[aria-label="Próximo"]');
      
      return {
        imgs,
        hasNextBtn: !!nextBtn
      };
    })()
  `;

  const data = await evaluate(wsUrl, script);
  console.log('Carousel info:', JSON.stringify(data, null, 2));
}

inspectCarousel().catch(console.error);
