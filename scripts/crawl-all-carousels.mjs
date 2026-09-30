import fs from 'fs';
import path from 'path';
import { getChromePage, evaluate, navigate } from './cdp-helper.mjs';

const vehiclesToCrawl = [
  { code: 'DZP5YYAFZTC', slug: 'jeep-compass-limited-t270-turbo-2022' },
  { code: 'DRhyjRsiSRk', slug: 'chevrolet-tracker-midnight-1-4-turbo-2019' },
  { code: 'DdkweJHjTVI', slug: 'renault-kangoo-expression-1-6-flex-2013' },
  { code: 'DdjmJ4wFdVI', slug: 'hyundai-creta-action-1-6-flex-automatico-2025' },
  { code: 'Dde-YPumSOX', slug: 'nissan-versa-exclusive-1-6-cvt-2021' },
  { code: 'Dde89PVGcJV', slug: 'hyundai-hb20-sense-1-0-flex-2024' },
  { code: 'DdXdlpyDXuT', slug: 'nissan-march-sl-1-6-manual-2015' },
  { code: 'DdUMMY8lVC8', slug: 'volkswagen-saveiro-robust-1-6-msi-2025' },
  { code: 'DdKCVEdlYJu', slug: 'chevrolet-onix-plus-lt-turbo-automatico-2022' },
  { code: 'DdFytr4jWt9', slug: 'ford-fusion-2-5-automatico-2011' },
  { code: 'DdEbeUFFQ3D', slug: 'chevrolet-onix-plus-turbo-automatico-2021' },
  { code: 'DdEMatxlekE', slug: 'volkswagen-constellation-19-360-cavalo-mecanico-2022' },
  { code: 'DcwJ8qlldS_', slug: 'ford-ka-se-1-0-flex-2019' },
  { code: 'DcuhABAjVcI', slug: 'fiat-strada-working-1-4-fire-flex-2018' },
  { code: 'DcugEqMDeSp', slug: 'peugeot-boxer-2-3-turbodiesel-15-lugares-2014' },
  { code: 'DcuMykAGcts', slug: 'hyundai-hb20-comfort-1-6-manual-2016' },
  { code: 'DcmmDVUDc89', slug: 'chevrolet-tracker-premier-1-4-turbo-2019' },
  { code: 'DcUFuQZGcNX', slug: 'citroen-c4-lounge-exclusive-1-6-thp-turbo-2017' },
  { code: 'DcPeJcyDaNk', slug: 'fiat-cronos-drive-1-0-flex-2024' },
  { code: 'DbBOz0KFQjf', slug: 'fiat-idea-attractive-1-4-flex-2014' },
];

async function crawlPost(wsUrl, code, slug) {
  console.log(`\n========================================`);
  console.log(`Processing [${slug}] (post: ${code})...`);

  const targetUrl = `https://www.instagram.com/p/${code}/`;
  await navigate(wsUrl, targetUrl);
  await new Promise(r => setTimeout(r, 3500));

  const collectedUrls = [];

  for (let step = 0; step < 25; step++) {
    const res = await evaluate(wsUrl, `
      (() => {
        // Collect carousel photos strictly inside the carousel ul
        const carouselUl = document.querySelector('ul:has(li img)');
        let imgs = [];
        if (carouselUl) {
          imgs = Array.from(carouselUl.querySelectorAll('img'))
            .filter(i => (i.naturalWidth >= 200 || i.width >= 200) && !i.src.includes('profile_pic') && !i.src.includes('rsrc.php'))
            .map(i => i.src);
        } else {
          // Single post image fallback
          const singleImg = document.querySelector('div._aagv img, div[role="button"] img');
          if (singleImg && (singleImg.naturalWidth >= 300 || singleImg.width >= 300)) {
            imgs = [singleImg.src];
          }
        }

        // Find next button
        let nextBtn = document.querySelector('button[aria-label="Next"], button[aria-label="Avançar"], button[aria-label="Próximo"], button[aria-label="_af37"]');
        if (!nextBtn) {
          const svgs = Array.from(document.querySelectorAll('svg[aria-label="Next"], svg[aria-label="Avançar"], svg[aria-label="Próximo"]'));
          for (const s of svgs) {
            const btn = s.closest('button');
            if (btn) {
              nextBtn = btn;
              break;
            }
          }
        }

        let clicked = false;
        if (nextBtn) {
          nextBtn.click();
          clicked = true;
        }

        return { imgs, clicked };
      })()
    `);

    if (res?.imgs) {
      for (const u of res.imgs) {
        if (!collectedUrls.includes(u)) {
          collectedUrls.push(u);
          console.log(`  + Found photo ${collectedUrls.length}: ${u.substring(0, 85)}...`);
        }
      }
    }

    if (!res?.clicked) {
      break;
    }

    await new Promise(r => setTimeout(r, 1200));
  }

  console.log(`Total photos found: ${collectedUrls.length}`);

  // Download photos
  const dir = path.join(process.cwd(), 'public', 'images', 'vehicles', slug);
  fs.mkdirSync(dir, { recursive: true });

  const savedRelativePaths = [];

  for (let i = 0; i < collectedUrls.length; i++) {
    const url = collectedUrls[i];
    const num = String(i + 1).padStart(2, '0');
    const dest = path.join(dir, `img_${num}.jpg`);
    try {
      const resp = await fetch(url);
      if (resp.ok) {
        const buf = Buffer.from(await resp.arrayBuffer());
        fs.writeFileSync(dest, buf);
        savedRelativePaths.push(`/images/vehicles/${slug}/img_${num}.jpg`);
        console.log(`  ✓ Saved img_${num}.jpg (${(buf.length / 1024).toFixed(1)} KB)`);
      }
    } catch (err) {
      console.error(`  ✗ Error saving img_${num}.jpg:`, err.message);
    }
  }

  // If no new images were downloaded, fallback to existing files
  if (savedRelativePaths.length === 0) {
    const existing = fs.readdirSync(dir).filter(f => f.startsWith('img_') && (f.endsWith('.jpg') || f.endsWith('.png')));
    if (existing.length > 0) {
      existing.sort().forEach(f => savedRelativePaths.push(`/images/vehicles/${slug}/${f}`));
    }
  }

  return savedRelativePaths;
}

async function main() {
  console.log('Connecting to user Chrome browser via CDP...');
  const page = await getChromePage();
  const wsUrl = page.webSocketDebuggerUrl;
  console.log('Connected to:', page.url);

  const vehiclesPath = path.join(process.cwd(), 'src', 'data', 'vehicles.json');
  const inventory = JSON.parse(fs.readFileSync(vehiclesPath, 'utf8'));

  for (let i = 0; i < vehiclesToCrawl.length; i++) {
    const item = vehiclesToCrawl[i];
    console.log(`\n======================================================`);
    console.log(`[${i + 1}/${vehiclesToCrawl.length}] CRAWLING: ${item.slug}`);
    console.log(`======================================================`);
    try {
      const savedPhotos = await crawlPost(wsUrl, item.code, item.slug);
      
      const veh = inventory.find(v => v.slug === item.slug);
      if (veh && savedPhotos.length > 0) {
        veh.images = savedPhotos;
        veh.coverImage = savedPhotos[0];
        console.log(`  ✓ Updated ${item.slug} in vehicles.json with ${savedPhotos.length} photos!`);
      }
      // Save progress to vehicles.json immediately
      fs.writeFileSync(vehiclesPath, JSON.stringify(inventory, null, 2), 'utf8');
    } catch (err) {
      console.error(`Failed to crawl ${item.slug}:`, err.message);
    }
  }

  console.log('\n======================================================');
  console.log('ALL CAROUSEL PHOTOS CRAWLED AND SAVED SUCCESSFULLY!');
  console.log('======================================================');
}

main().catch(console.error);
