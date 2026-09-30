import fs from 'fs';
import https from 'https';
import path from 'path';
import { getChromePage, navigate, evaluate } from './cdp-helper.mjs';

const reelsData = JSON.parse(fs.readFileSync('src/data/instagramReels.json', 'utf-8'));

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Status ${res.statusCode}`));
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', reject);
  });
}

async function scrapeReelVideos() {
  const page = await getChromePage();
  const wsUrl = page.webSocketDebuggerUrl;

  if (!fs.existsSync('public/videos/reels')) {
    fs.mkdirSync('public/videos/reels', { recursive: true });
  }

  const updatedReels = [];

  for (let i = 0; i < reelsData.length; i++) {
    const item = reelsData[i];
    const filename = `reel_${i + 1}.mp4`;
    const dest = path.join('public/videos/reels', filename);

    console.log(`\n[${i + 1}/${reelsData.length}] Processing ${item.id} (${item.title})...`);

    // Check if already downloaded
    if (fs.existsSync(dest) && fs.statSync(dest).size > 100000) {
      console.log(`Already downloaded: ${filename} (${fs.statSync(dest).size} bytes)`);
      updatedReels.push({
        ...item,
        video: `/videos/reels/${filename}`
      });
      continue;
    }

    try {
      const embedUrl = `https://www.instagram.com/reel/${item.id}/embed/`;
      await navigate(wsUrl, embedUrl);
      await new Promise(r => setTimeout(r, 2500));

      let videoSrc = await evaluate(wsUrl, `
        (() => {
          const v = document.querySelector('video');
          return v ? v.src : null;
        })()
      `);

      if (!videoSrc) {
        // Try waiting a bit more
        await new Promise(r => setTimeout(r, 2500));
        videoSrc = await evaluate(wsUrl, `
          (() => {
            const v = document.querySelector('video');
            return v ? v.src : null;
          })()
        `);
      }

      if (videoSrc) {
        console.log(`Found video URL for ${item.id}. Downloading to ${filename}...`);
        await downloadFile(videoSrc, dest);
        console.log(`Saved ${filename} (${fs.statSync(dest).size} bytes)`);
        updatedReels.push({
          ...item,
          video: `/videos/reels/${filename}`
        });
      } else {
        console.warn(`No video element found for ${item.id}`);
        updatedReels.push(item);
      }
    } catch (err) {
      console.error(`Error processing ${item.id}:`, err.message);
      updatedReels.push(item);
    }
  }

  fs.writeFileSync('src/data/instagramReels.json', JSON.stringify(updatedReels, null, 2), 'utf-8');
  console.log('\nAll done! Updated src/data/instagramReels.json');
}

scrapeReelVideos().catch(console.error);
