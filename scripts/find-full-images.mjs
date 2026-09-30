import fs from 'fs';

const html = fs.readFileSync('C:/Users/bruno/.gemini/antigravity-ide/brain/e3b99411-c6b6-47d9-b0ff-e467b83f8a06/.system_generated/steps/95/content.md', 'utf8');

const regex = /https:\/\/[^"'\\\s]+cdninstagram\.com[^"'\\\s]+/g;
const matches = [...html.matchAll(regex)].map(m => m[0].replace(/\\u0026/g, '&').replace(/&amp;/g, '&'));
const jpgs = matches.filter(url => url.includes('.jpg') || url.includes('.webp'));
const unique = [...new Set(jpgs)];

console.log('Total images found in post 4 HTML:', unique.length);
unique.forEach((u, i) => {
  console.log(`\n--- Image ${i} ---`);
  console.log(u);
});
