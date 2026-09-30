import fs from 'fs';
import path from 'path';

const posts = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'scripts', 'posts-data.json'), 'utf8'));

// Mapping of new vehicles to their post codes and slugs
const newVehiclesMapping = [
  { postCode: 'DZP5YYAFZTC', slug: 'jeep-compass-limited-t270-turbo-2022' },
  { postCode: 'DRhyjRsiSRk', slug: 'chevrolet-tracker-midnight-1-4-turbo-2019' },
  { postCode: 'DdkweJHjTVI', slug: 'renault-kangoo-expression-1-6-flex-2013' },
  { postCode: 'DdjmJ4wFdVI', slug: 'hyundai-creta-action-1-6-flex-automatico-2025' },
  { postCode: 'Dde-YPumSOX', slug: 'nissan-versa-exclusive-1-6-cvt-2021' },
  { postCode: 'Dde89PVGcJV', slug: 'hyundai-hb20-sense-1-0-flex-2024' },
  { postCode: 'DdXdlpyDXuT', slug: 'nissan-march-sl-1-6-manual-2015' },
  { postCode: 'DdUMMY8lVC8', slug: 'volkswagen-saveiro-robust-1-6-msi-2025' },
  { postCode: 'DdKCVEdlYJu', slug: 'chevrolet-onix-plus-lt-turbo-automatico-2022' },
  { postCode: 'DdFytr4jWt9', slug: 'ford-fusion-2-5-automatico-2011' },
  { postCode: 'DdEbeUFFQ3D', slug: 'chevrolet-onix-plus-turbo-automatico-2021' },
  { postCode: 'DdEMatxlekE', slug: 'volkswagen-constellation-19-360-cavalo-mecanico-2022' },
  { postCode: 'DcwJ8qlldS_', slug: 'ford-ka-se-1-0-flex-2019' },
  { postCode: 'DcuhABAjVcI', slug: 'fiat-strada-working-1-4-fire-flex-2018' },
  { postCode: 'DcugEqMDeSp', slug: 'peugeot-boxer-2-3-turbodiesel-15-lugares-2014' },
  { postCode: 'DcuMykAGcts', slug: 'hyundai-hb20-comfort-1-6-manual-2016' },
  { postCode: 'DcmmDVUDc89', slug: 'chevrolet-tracker-premier-1-4-turbo-2019' },
  { postCode: 'DcUFuQZGcNX', slug: 'citroen-c4-lounge-exclusive-1-6-thp-turbo-2017' },
  { postCode: 'DcPeJcyDaNk', slug: 'fiat-cronos-drive-1-0-flex-2024' },
  { postCode: 'DbBOz0KFQjf', slug: 'fiat-idea-attractive-1-4-flex-2014' },
];

async function downloadImages() {
  console.log('Downloading images for 20 new vehicles...');
  
  for (const item of newVehiclesMapping) {
    const post = posts.find(p => p.postCode === item.postCode);
    if (!post || !post.ogImage) {
      console.error(`❌ Post ${item.postCode} has no ogImage`);
      continue;
    }

    const dir = path.join(process.cwd(), 'public', 'images', 'vehicles', item.slug);
    fs.mkdirSync(dir, { recursive: true });
    const imgPath = path.join(dir, 'img_01.jpg');

    try {
      const res = await fetch(post.ogImage);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const arrayBuffer = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      fs.writeFileSync(imgPath, buffer);
      console.log(`✅ Saved ${item.slug} (${buffer.length} bytes)`);
    } catch (err) {
      console.error(`❌ Error downloading ${item.slug}:`, err.message);
    }
  }

  console.log('Done downloading all images.');
}

downloadImages();
