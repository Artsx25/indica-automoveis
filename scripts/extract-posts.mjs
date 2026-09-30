import fs from 'fs';
import path from 'path';

const links = [
  "https://www.instagram.com/p/DZP5YYAFZTC/?stkn=YWtqM282OGZjcnll",
  "https://www.instagram.com/p/DRhyjRsiSRk/?stkn=OTl1MnZtcW91b2x1",
  "https://www.instagram.com/p/DdkweJHjTVI/?stkn=NjFzdzNkOGs1M21k",
  "https://www.instagram.com/p/DdjmJ4wFdVI/?stkn=ajJxZjV2eDR5djJp",
  "https://www.instagram.com/p/Dde-YPumSOX/?stkn=M3UxZHYzYmVjNWVk",
  "https://www.instagram.com/p/Dde89PVGcJV/?stkn=YWpzb2N5ZDlycTlu",
  "https://www.instagram.com/p/DdXdlpyDXuT/?stkn=Z3hqeHgzdzVqNXM5",
  "https://www.instagram.com/p/DdUMMY8lVC8/?stkn=MXZtenhiOWYzM2M4aw==",
  "https://www.instagram.com/p/DdKCVEdlYJu/?stkn=MWR1Y3dsZnhpaWUzcQ==",
  "https://www.instagram.com/p/DdFytr4jWt9/?stkn=MWl6dm1tdHd5dTBvbg==",
  "https://www.instagram.com/p/DdEbeUFFQ3D/?stkn=a2p5Mjc1Z2ZkOHp2",
  "https://www.instagram.com/p/DdEMatxlekE/?stkn=d2I1ZmMxdDYwMjNi",
  "https://www.instagram.com/p/DcwJ8qlldS_/?stkn=bzd4Y2ZxaXIwMzlv",
  "https://www.instagram.com/p/DcuhABAjVcI/?stkn=bjFoNnBobGgwcmpz",
  "https://www.instagram.com/p/DcugEqMDeSp/?stkn=Nng3ZXJ5cWI5cW1n",
  "https://www.instagram.com/p/DcuMykAGcts/?stkn=c3dlenlkdWFoNnU5",
  "https://www.instagram.com/p/DcmmDVUDc89/?stkn=MTdjMmIwOTY1MG9jMQ==",
  "https://www.instagram.com/p/DcUFuQZGcNX/?stkn=dXdyYzFsaXc3MHpz",
  "https://www.instagram.com/p/DcPeJcyDaNk/?stkn=MTN3Zm84cGl6Z3BrNw==",
  "https://www.instagram.com/p/DcJs8h6lcb4/?stkn=bWthd2JscTY1MHBk",
  "https://www.instagram.com/p/Db_e5gAmRng/?stkn=MWZrZjI3YWNiNDJvYg==",
  "https://www.instagram.com/p/Db-0AF3FT3X/?stkn=eG1icWYxazV2cm1r",
  "https://www.instagram.com/p/Dbv5FQtlbX1/?stkn=MTZxaHlnNXZyc3U5eQ==",
  "https://www.instagram.com/p/DbTybRomcSZ/?stkn=MWlheWhxenRiZHEzaQ==",
  "https://www.instagram.com/p/DbSttlLlYG5/?stkn=MTNlZW9wbzhoamg3Zw==",
  "https://www.instagram.com/p/DbBOz0KFQjf/?stkn=YWFmZHZ1MndodHJ3",
  "https://www.instagram.com/p/DaDx8VsFTlz/?stkn=MWlzYmFxeDFveWJndA=="
];

function decodeHtmlEntities(str) {
  if (!str) return '';
  return str
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
    .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
    .replace(/&#x([0-9a-fA-F]+);/g, (match, hex) => String.fromCodePoint(parseInt(hex, 16)));
}

async function fetchPost(url, index) {
  const cleanUrl = url.split('?')[0];
  const postCode = cleanUrl.replace('https://www.instagram.com/p/', '').replace('/', '');
  
  try {
    const res = await fetch(cleanUrl, {
      headers: {
        'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7'
      }
    });

    const html = await res.text();
    
    // Find og:description or description
    const descMatch = html.match(/<meta\s+(?:property="og:description"|name="description")\s+content="([^"]*)"/i)
      || html.match(/content="([^"]*)"\s+(?:property="og:description"|name="description")/i);

    const titleMatch = html.match(/<meta\s+property="og:title"\s+content="([^"]*)"/i);
    const imageMatch = html.match(/<meta\s+property="og:image"\s+content="([^"]*)"/i);

    // Also look for other images
    const allImages = [];
    if (imageMatch) {
      allImages.push(imageMatch[1].replace(/&amp;/g, '&'));
    }

    const rawDescription = descMatch ? decodeHtmlEntities(descMatch[1]) : '';
    const rawTitle = titleMatch ? decodeHtmlEntities(titleMatch[1]) : '';
    const ogImage = imageMatch ? imageMatch[1].replace(/&amp;/g, '&') : '';

    return {
      index,
      postCode,
      url: cleanUrl,
      title: rawTitle,
      description: rawDescription,
      ogImage,
      allImages
    };
  } catch (err) {
    return {
      index,
      postCode,
      url: cleanUrl,
      error: err.message
    };
  }
}

async function main() {
  console.log(`Starting fetch of ${links.length} Instagram posts...`);
  const results = [];
  
  for (let i = 0; i < links.length; i++) {
    const link = links[i];
    console.log(`[${i + 1}/${links.length}] Fetching ${link}...`);
    const data = await fetchPost(link, i);
    results.push(data);
    // Pequena pausa para evitar rate limit
    await new Promise(r => setTimeout(r, 600));
  }

  const outPath = path.join(process.cwd(), 'scripts', 'posts-data.json');
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2), 'utf-8');
  console.log(`Done! Saved ${results.length} posts to ${outPath}`);
}

main();
