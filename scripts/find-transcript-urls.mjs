import fs from 'fs';

const path = 'C:/Users/bruno/.gemini/antigravity-ide/brain/e3b99411-c6b6-47d9-b0ff-e467b83f8a06/.system_generated/logs/transcript.jsonl';
const content = fs.readFileSync(path, 'utf8');

const regex = /https:\/\/[^"'\s\\]+cdninstagram\.com[^"'\s\\]+/g;
const matches = [...content.matchAll(regex)].map(m => m[0].replace(/\\u0026/g, '&').replace(/&amp;/g, '&'));
const unique = [...new Set(matches)];

console.log('Total URLs found in transcript:', unique.length);
unique.forEach((u, i) => console.log(`[${i}] ${u}`));
