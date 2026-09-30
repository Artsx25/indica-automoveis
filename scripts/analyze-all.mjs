import fs from 'fs';
import path from 'path';

const posts = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'scripts', 'posts-data.json'), 'utf8'));

let doc = '# ANÁLISE DOS 27 POSTS DO INSTAGRAM\n\n';

posts.forEach((p, idx) => {
  doc += `## #${idx + 1} - ${p.postCode}\n`;
  doc += `- **URL**: ${p.url}\n`;
  doc += `- **Foto de capa**: ${p.ogImage ? 'SIM' : 'NÃO'}\n`;
  
  // Extract lines from description
  const desc = p.description || '';
  const lines = desc.split('\n').map(l => l.trim()).filter(Boolean);
  
  // Try to find price
  const priceMatches = desc.match(/R\$\s*[\d\.,]+/gi) || [];
  doc += `- **Preços encontrados**: ${priceMatches.join(' | ')}\n`;
  
  // Try to find KM
  const kmMatches = desc.match(/\b\d+[\.,]?\d*\s*(?:mil\s*)?km\b/gi) || [];
  doc += `- **KM encontrado**: ${kmMatches.join(' | ')}\n`;

  // Try to find Year
  const yearMatches = desc.match(/\b(19\d\d|20\d\d)\s*\/\s*(19\d\d|20\d\d)\b/g) || desc.match(/\b(20\d\d)\b/g) || [];
  doc += `- **Ano encontrado**: ${yearMatches.slice(0, 3).join(' | ')}\n`;

  doc += `\n**Texto do Post:**\n\`\`\`\n${lines.join('\n')}\n\`\`\`\n\n---\n\n`;
});

fs.writeFileSync(path.join(process.cwd(), 'scripts', 'all-posts-detailed.md'), doc, 'utf8');
console.log('Saved all-posts-detailed.md');
