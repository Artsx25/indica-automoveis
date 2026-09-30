import fs from 'fs';

const html = fs.readFileSync('scripts/embed.html', 'utf8');

// Find all occurrences of image URLs
const regex = /https:\/\/[^"'\s\\]+cdninstagram\.com[^"'\s\\]+/g;
const unescaped = html.replace(/\\\//g, '/').replace(/\\u0026/g, '&');
const matches = [...unescaped.matchAll(regex)].map(m => m[0]);
const jpgs = [...new Set(matches.filter(u => u.includes('.jpg') || u.includes('.webp')))];

console.log('Total JPG/WEBP found in embed:', jpgs.length);

// Group by base image ID
const groups = {};
for (const url of jpgs) {
  const m = url.match(/\/([0-9]+_[0-9]+_[0-9]+_n\.(?:jpg|webp))/);
  if (m) {
    const id = m[1];
    if (!groups[id]) groups[id] = [];
    groups[id].push(url);
  } else {
    if (!groups['other']) groups['other'] = [];
    groups['other'].push(url);
  }
}

console.log('Image groups (different photos):', Object.keys(groups).length);
for (const [id, urls] of Object.entries(groups)) {
  console.log(`\nPhoto ID: ${id} (${urls.length} variants)`);
  // Pick the largest variant (e.g. s1080x1080 or highest resolution)
  const sorted = urls.sort((a, b) => b.length - a.length);
  console.log('Sample URL:', sorted[0]);
}
