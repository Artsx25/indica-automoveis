import https from 'node:https'
import fs from 'node:fs'
import path from 'node:path'

if (!fs.existsSync('public/images/reels')) {
  fs.mkdirSync('public/images/reels', { recursive: true })
}

const reelsData = JSON.parse(fs.readFileSync('scripts/reels-scraped.json', 'utf-8'))
const outputReels = []

// Titles / descriptions based on the vehicles in the reels
const REEL_METADATA = {
  'DdkpSVJNgdL': { title: 'Volkswagen Constellation 19.360', tag: 'Caminhão Pesado' },
  'DcmVGiDNBoa': { title: 'Chevrolet Tracker Midnight - Interior & Detalhes', tag: 'SUV Turbo' },
  'DcJO6haM-a9': { title: 'Renault Duster Intense - Lanternas & Visual', tag: 'SUV 1.6 CVT' },
  'DcJKjgqhmAq': { title: 'Citroën C4 Lounge Feel Turbo THP', tag: 'Sedã Premium' },
  'Dagpv_HN8IQ': { title: 'Apresentação de Estoque Seminovos', tag: 'Showroom' },
  'DaOyE_fNFzE': { title: 'Mais Uma Entrega Concluída com Sucesso', tag: 'Cliente Feliz' },
  'DZvlMUMuhpF': { title: 'Tour pelo Pátio Indica Automóveis', tag: 'Novidades' },
  'DZfq-dYMKb-': { title: 'Condições de Financiamento Sem Entrada', tag: 'Financiamento' },
  'DZfqwXvSga4': { title: 'Carros Periciados e Prontos para Rodar', tag: 'Garantia' },
  'DZeCs27tyYh': { title: 'Avaliação de Troca Justa na Loja', tag: 'Avaliação' },
  'DZeBy1JtNR3': { title: 'Venha Tomar um Café Conosco', tag: 'Atendimento' },
  'DZWIWoTtFiN': { title: 'Mega Ofertas da Semana Indica', tag: 'Imperdível' },
}

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
  for (let i = 0; i < reelsData.length; i++) {
    const item = reelsData[i]
    if (!item.imgSrc) continue

    const filename = `reel_${i + 1}.jpg`
    const dest = path.join('public/images/reels', filename)

    try {
      console.log(`Downloading ${filename} from ${item.postCode}...`)
      await download(item.imgSrc, dest)

      const meta = REEL_METADATA[item.postCode] || { title: `Reel @indica.automoveis`, tag: 'Reels' }

      outputReels.push({
        id: item.postCode,
        url: item.url,
        image: `/images/reels/${filename}`,
        title: meta.title,
        tag: meta.tag,
        views: item.views ? `${item.views} visualizações` : 'Em alta',
      })
    } catch (err) {
      console.error(`Error downloading ${item.postCode}:`, err.message)
    }
  }

  fs.writeFileSync('src/data/instagramReels.json', JSON.stringify(outputReels, null, 2))
  console.log(`Successfully saved ${outputReels.length} reels to src/data/instagramReels.json!`)
}

run()
