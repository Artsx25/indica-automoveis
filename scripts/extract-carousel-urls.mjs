import fs from 'fs';

const html = fs.readFileSync('scripts/embed.html', 'utf8');

// Unescape slashes
const cleanHtml = html.replace(/\\\//g, '/').replace(/\\u0026/g, '&');

// Look for image urls
const regex = /https:\/\/[^"'\\<>\s]+cdninstagram\.com[^"'\\<>\s]+/g;
const matches = [...cleanHtml.matchAll(regex)].map(m => m[0]);
const jpgs = matches.filter(u => (u.includes('.jpg') || u.includes('.webp')) && !u.includes('profile_pic') && !u.includes('rsrc.php'));
const unique = [...new Set(jpgs)];

console.log('Total vehicle image URLs found:', unique.length);
unique.forEach((u, i) => {
  console.log(`\n[${i}] ${u.substring(0, 120)}...`);
});
