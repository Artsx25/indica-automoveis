import fs from 'fs';

async function testEmbed(code) {
  const url = `https://www.instagram.com/p/${code}/embed/captioned/`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });
  console.log(`Status for ${code}:`, res.status);
  const html = await res.text();
  fs.writeFileSync('scripts/embed.html', html, 'utf8');
  
  const regex = /https:\/\/[^"'\\\s]+cdninstagram\.com[^"'\\\s]+/g;
  const matches = [...html.matchAll(regex)].map(m => m[0].replace(/\\u0026/g, '&').replace(/&amp;/g, '&'));
  const unique = [...new Set(matches)];
  console.log('URLs in embed:', unique.length);
  unique.forEach((u, i) => console.log(`[${i}] ${u}`));
}

testEmbed('DZP5YYAFZTC');
