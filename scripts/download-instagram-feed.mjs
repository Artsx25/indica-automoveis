import https from 'node:https'
import fs from 'node:fs'
import path from 'node:path'

if (!fs.existsSync('public/images/instagram')) {
  fs.mkdirSync('public/images/instagram', { recursive: true })
}

const posts = JSON.parse(fs.readFileSync('scripts/posts-data.json', 'utf-8'))
const feedPosts = []

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      if (res.statusCode !== 200) return reject(new Error('Status ' + res.statusCode))
      const file = fs.createWriteStream(dest)
      res.pipe(file)
      file.on('finish', () => file.close(resolve))
    }).on('error', reject)
  })
}

async function run() {
  for (let i = 0; i < Math.min(posts.length, 8); i++) {
    const p = posts[i]
    const filename = `post_${i + 1}.jpg`
    const dest = path.join('public/images/instagram', filename)
    try {
      if (!fs.existsSync(dest) || fs.statSync(dest).size === 0) {
        console.log(`Downloading ${filename}...`)
        await download(p.ogImage, dest)
      }

      let caption = p.title ? p.title.replace(/^Indica Automóveis no Instagram: "/, '').replace(/"$/, '') : ''
      caption = caption.split('\n')[0].replace(/[🔥🚗🚘✨🚙💎🚐•]/g, '').trim()
      if (!caption || caption.length < 5) {
        caption = 'Confira este veículo no nosso Instagram'
      }

      let likes = '15'
      const m = (p.description || '').match(/(\d+)\s+likes/)
      if (m) likes = m[1]

      feedPosts.push({
        id: p.postCode || `post_${i}`,
        url: p.url,
        image: `/images/instagram/${filename}`,
        caption: caption,
        likes: Number(likes) || 18,
      })
    } catch (e) {
      console.error(`Error downloading post ${i}:`, e.message)
    }
  }

  fs.writeFileSync('src/data/instagramPosts.json', JSON.stringify(feedPosts, null, 2))
  console.log(`Saved ${feedPosts.length} posts to src/data/instagramPosts.json`)
}

run()
