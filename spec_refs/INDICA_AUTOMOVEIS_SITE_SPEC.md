# SPEC MASTER — Site de Estoque e Geração de Leads | Indica Automóveis

> **Instrução principal ao agente:** construa o projeto completo seguindo esta especificação. Não faça apenas um mockup visual. Entregue uma aplicação React/Vite funcional, responsiva, pronta para Cloudflare Pages, com catálogo de veículos baseado em dados, busca/filtros dinâmicos, páginas individuais de veículos, SEO técnico e CTAs de WhatsApp orientados à conversão.
>
> **Regra de ouro:** o site **NÃO vende carros online**. Não existe checkout. O objetivo do site é apresentar o estoque, ajudar o visitante a encontrar o veículo certo e transformar cada intenção em conversa no WhatsApp da loja.

---

## 0. Contexto do projeto

### Empresa
- **Nome:** Indica Automóveis
- **Instagram:** https://www.instagram.com/indica.automoveis/
- **WhatsApp principal informado para o projeto:** **(11) 98780-2814**
- **WhatsApp normalizado:** `5511987802814`
- **Endereço informado para o projeto:** **Av. Ragueb Chohfi, 441, São Paulo, Brazil**
- **Objetivo primário:** geração de leads qualificados para WhatsApp.
- **Objetivo secundário:** facilitar busca, comparação e descoberta do estoque.
- **Tipo do site:** catálogo/e-commerce de veículos **sem compra online**.

### Mensagens atuais da marca encontradas no Instagram
Usar somente como apoio de conteúdo e validar antes da publicação:
- “Realizando sonhos sobre rodas”
- “+700 veículos vendidos em 3 anos”
- “Transparência em primeiro lugar”

> **ATENÇÃO DE CADASTRO:** o endereço público indexado no Instagram apareceu como número **439**, mas o dado fornecido para este projeto é **441**. Usar `441` no código/configuração por enquanto e deixar um `TODO_CONFIRM_ADDRESS` no arquivo de configuração antes da publicação final.

---

# 1. Stack obrigatória

## Front-end
- **React**
- **Vite**
- **TypeScript**
- SPA com rotas via **React Router**
- Hospedagem: **Cloudflare Pages — plano gratuito**
- Build:
  - comando: `npm run build`
  - diretório de saída: `dist`

## Dependências recomendadas
Usar somente quando agregarem valor real:
- `react-router-dom`
- `zod` para validar o cadastro dos veículos
- `lucide-react` para ícones
- `clsx` ou equivalente pequeno para composição de classes
- CSS responsivo com:
  - Tailwind CSS **ou**
  - CSS Modules + design tokens
- Evitar UI kits pesados.

## Não usar nesta primeira versão
- Next.js
- SSR obrigatório
- banco de dados
- checkout
- autenticação
- painel administrativo
- backend tradicional
- APIs pagas
- dependências desnecessariamente pesadas

### Motivo da arquitetura
Nesta fase, os veículos serão inseridos pelo agente no repositório. Portanto, o catálogo deve ter **uma única fonte de verdade local**, simples de atualizar e compatível com Cloudflare Pages grátis.

A arquitetura deve, porém, usar uma camada `VehicleRepository`/`inventory service` para que no futuro seja possível trocar JSON local por API, D1, Supabase ou outro CMS **sem reescrever as páginas e os filtros**.

---

# 2. Referências visuais anexadas

## Referência 01 — home + estoque em cards
![Referência Home/Inventory](./references/01-referencia-home-inventory-zoomcar.png)

Usar como inspiração para:
- hero de busca
- grid de veículos
- cards
- sessão de marcas
- organização editorial
- experiência mobile
- densidade visual de um grande portal automotivo

## Referência 02 — pesquisa avançada
![Referência filtros estilo Tesla](./references/02-referencia-filtros-inventory-tesla.png)

Usar como inspiração para:
- sidebar de filtros no desktop
- filtros limpos e organizados
- inputs/selects objetivos
- conteúdo do estoque à direita
- versão mobile usando drawer/bottom sheet de filtros

## Referência 03 — modelos disponíveis no Antigravity
![Referência modelos Antigravity](./references/03-referencia-modelos-antigravity.png)

Essa imagem é apenas uma referência do ambiente/modelos disponíveis. A implementação deve ser independente do modelo escolhido.

---

# 3. Benchmarks de UX automotiva

Foram considerados padrões atuais de portais como **Webmotors**, **iCarros**, **OLX Autos** e os layouts das referências anexadas.

Padrões que devem ser incorporados:
1. busca imediata por marca/modelo;
2. filtros por faixa de preço;
3. filtros por ano;
4. filtros por quilometragem;
5. filtros por câmbio;
6. filtros por combustível;
7. filtros por carroceria;
8. chips mostrando filtros ativos;
9. ordenação do estoque;
10. card com preço + ano + km + informações essenciais;
11. página detalhada com galeria de fotos;
12. CTAs persistentes de contato;
13. experiência mobile com poucos cliques;
14. URL compartilhável com filtros aplicados;
15. mensagens de WhatsApp já contextualizadas com o veículo.

### Fontes consultadas durante o planejamento
- Webmotors: https://www.webmotors.com.br/carros/sp-sao-paulo
- iCarros — tutorial de busca: https://ajuda.icarros.com.br/hc/pt-br/articles/9011065940891-Tutorial-de-como-realizar-uma-busca-no-iCarros
- Cloudflare Pages — React: https://developers.cloudflare.com/pages/framework-guides/deploy-a-react-site/
- Cloudflare Pages — limites: https://developers.cloudflare.com/pages/platform/limits/

Não copiar identidade visual nem layout 1:1. Usar somente padrões de UX já consolidados.

---

# 4. Filosofia do produto

O site deve responder rapidamente a quatro perguntas:

1. **Quais carros vocês têm?**
2. **Vocês têm o modelo/faixa de preço que eu procuro?**
3. **Quais são os detalhes desse carro?**
4. **Como falo agora com um vendedor?**

Toda página deve possuir pelo menos um caminho claro para WhatsApp.

Não transformar a interface em “landing page agressiva”. A sensação deve ser:
- loja profissional;
- estoque confiável;
- navegação rápida;
- visual premium;
- informações objetivas;
- contato humano imediato.

---

# 5. Rotas obrigatórias

```txt
/
├── /estoque
├── /veiculo/:slug
├── /financiamento
├── /venda-seu-carro
├── /sobre
├── /contato
├── /politica-de-privacidade
└── /404
```

### Aliases opcionais
- `/carros` -> `/estoque`
- `/carros/:slug` -> `/veiculo/:slug`

---

# 6. Estrutura recomendada de diretórios

```txt
indica-automoveis/
├── public/
│   ├── favicon/
│   ├── brand/
│   ├── vehicles/
│   │   └── <slug-do-veiculo>/
│   │       ├── 01.webp
│   │       ├── 02.webp
│   │       └── ...
│   ├── robots.txt
│   └── _headers
│
├── scripts/
│   ├── validate-inventory.mjs
│   ├── generate-sitemap.mjs
│   └── prerender-vehicles.mjs
│
├── src/
│   ├── app/
│   │   ├── router.tsx
│   │   └── App.tsx
│   │
│   ├── components/
│   │   ├── layout/
│   │   ├── vehicle/
│   │   ├── filters/
│   │   ├── search/
│   │   ├── whatsapp/
│   │   ├── seo/
│   │   └── ui/
│   │
│   ├── config/
│   │   ├── business.ts
│   │   └── analytics.ts
│   │
│   ├── data/
│   │   └── vehicles.json
│   │
│   ├── domain/
│   │   ├── vehicle.types.ts
│   │   ├── vehicle.schema.ts
│   │   └── vehicle.repository.ts
│   │
│   ├── hooks/
│   │   ├── useInventoryFilters.ts
│   │   ├── useUTM.ts
│   │   └── useWhatsAppLead.ts
│   │
│   ├── lib/
│   │   ├── search.ts
│   │   ├── filterFacets.ts
│   │   ├── format.ts
│   │   ├── slug.ts
│   │   ├── whatsapp.ts
│   │   └── analytics.ts
│   │
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── InventoryPage.tsx
│   │   ├── VehicleDetailPage.tsx
│   │   ├── FinancingPage.tsx
│   │   ├── SellYourCarPage.tsx
│   │   ├── AboutPage.tsx
│   │   ├── ContactPage.tsx
│   │   ├── PrivacyPage.tsx
│   │   └── NotFoundPage.tsx
│   │
│   ├── styles/
│   │   ├── globals.css
│   │   └── tokens.css
│   │
│   ├── main.tsx
│   └── vite-env.d.ts
│
├── .env.example
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

# 7. Fonte única de verdade do estoque

## Regra crítica
**NUNCA hardcodar marca, modelo, ano, combustível ou qualquer opção de filtro na interface.**

Todo filtro deve ser calculado a partir dos veículos cadastrados em `src/data/vehicles.json`.

Exemplo:

Se hoje existem:
- Chevrolet Onix
- Jeep Renegade
- Honda Civic

o filtro de marca deve mostrar:
- Chevrolet
- Honda
- Jeep

Se amanhã o agente adicionar:
- Volkswagen T-Cross

o site deve, automaticamente, passar a mostrar:
- Volkswagen na marca;
- T-Cross no modelo;
- seus anos/faixas relevantes;
- sua carroceria/combustível/câmbio;
- o veículo nos resultados de busca.

Nenhum arquivo de filtro deve precisar de edição manual.

---

# 8. Schema obrigatório do veículo

Criar um schema `Vehicle` fortemente tipado e validado.

Exemplo de objeto:

```json
{
  "id": "veh_0001",
  "slug": "jeep-renegade-longitude-1-8-2021",
  "status": "available",
  "featured": true,
  "createdAt": "2026-08-18T12:00:00-03:00",
  "updatedAt": "2026-08-18T12:00:00-03:00",

  "make": "Jeep",
  "model": "Renegade",
  "version": "Longitude 1.8 AT",
  "title": "Jeep Renegade Longitude 1.8 Automático",
  "yearManufacture": 2021,
  "yearModel": 2021,

  "price": 89990,
  "mileageKm": 52000,

  "transmission": "automatic",
  "fuel": "flex",
  "bodyType": "suv",
  "color": "Preto",
  "doors": 4,
  "engine": "1.8",
  "traction": "4x2",

  "description": "Descrição comercial do veículo.",
  "highlights": [
    "Câmbio automático",
    "Central multimídia",
    "Câmera de ré"
  ],

  "options": [
    "Ar-condicionado",
    "Direção elétrica",
    "Vidros elétricos"
  ],

  "acceptsTradeIn": true,
  "financingAvailable": true,

  "images": [
    "/vehicles/jeep-renegade-longitude-1-8-2021/01.webp",
    "/vehicles/jeep-renegade-longitude-1-8-2021/02.webp"
  ],

  "coverImage": "/vehicles/jeep-renegade-longitude-1-8-2021/01.webp",

  "seo": {
    "title": "Jeep Renegade Longitude 2021 à venda | Indica Automóveis",
    "description": "Veja fotos, preço e detalhes do Jeep Renegade Longitude 2021 disponível na Indica Automóveis em São Paulo."
  }
}
```

## Enum/status
```ts
type VehicleStatus =
  | "available"
  | "reserved"
  | "sold"
  | "draft";
```

### Regras
- `available`: aparece normalmente.
- `reserved`: aparece com badge “Reservado”, pode continuar recebendo contato.
- `sold`: sai da listagem principal, mas a URL pode continuar funcionando com aviso “Este veículo foi vendido” + veículos semelhantes.
- `draft`: nunca aparece publicamente.

---

# 9. Validação de estoque

Implementar `zod` e um script:

```bash
npm run validate:inventory
```

O build deve falhar se houver:
- `id` duplicado;
- `slug` duplicado;
- preço inválido;
- ano inválido;
- ausência de imagem;
- ausência de marca/modelo;
- status inválido;
- URL/caminho de imagem quebrado quando detectável;
- campos obrigatórios ausentes.

## Scripts sugeridos

```json
{
  "scripts": {
    "dev": "vite",
    "validate:inventory": "node scripts/validate-inventory.mjs",
    "build": "npm run validate:inventory && vite build && node scripts/prerender-vehicles.mjs && node scripts/generate-sitemap.mjs",
    "preview": "vite preview"
  }
}
```

Se a validação com TS exigir outra estratégia, manter o comportamento, não necessariamente o código exato acima.

---

# 10. Pesquisa inteligente

## Busca textual
A barra principal deve pesquisar, no mínimo:
- marca;
- modelo;
- versão;
- ano;
- combustível;
- câmbio;
- carroceria.

### Normalização obrigatória
Ignorar:
- maiúsculas/minúsculas;
- acentos;
- hífens;
- espaços duplicados.

Exemplo:
- `renegade`
- `Renégade`
- `JEEP RENEGADE`
- `jeep 2021`

devem produzir resultados coerentes.

### Busca multi-token
Consulta:
```txt
civic 2020 automatico
```

deve cruzar os tokens disponíveis no índice do veículo.

---

# 11. Facets/filtros 100% dinâmicos

Criar função:

```ts
buildInventoryFacets(vehicles)
```

Ela deve gerar automaticamente:

```ts
{
  makes: [],
  modelsByMake: {},
  years: [],
  minPrice: 0,
  maxPrice: 0,
  transmissions: [],
  fuels: [],
  bodyTypes: [],
  colors: []
}
```

## Filtros obrigatórios
- Busca livre
- Marca
- Modelo
- Ano mínimo
- Ano máximo
- Preço mínimo
- Preço máximo
- Quilometragem máxima
- Câmbio
- Combustível
- Carroceria
- Cor
- Aceita troca
- Financiamento disponível

## Comportamento dependente
Ao selecionar uma **marca**, o filtro **modelo** deve passar a exibir somente os modelos existentes daquela marca.

Ao remover a marca, a lista de modelos volta a considerar todo o estoque.

---

# 12. URL como estado da pesquisa

Os filtros devem ser serializados na URL.

Exemplos:

```txt
/estoque?marca=jeep&modelo=renegade
/estoque?marca=honda&anoMin=2020&precoMax=120000
/estoque?carroceria=suv&cambio=automatic
```

Benefícios:
- link compartilhável;
- botão voltar do navegador funciona;
- campanhas podem apontar para uma busca específica;
- recuperação de estado;
- melhor rastreabilidade.

Não guardar a busca exclusivamente em estado efêmero do React.

---

# 13. Ordenação

Opções:
- Mais recentes
- Menor preço
- Maior preço
- Menor quilometragem
- Mais novos (ano)
- Destaques

A ordenação default pode ser:
1. `featured = true`
2. mais recentes

---

# 14. Página inicial — `/`

## 14.1 Header
Desktop:
- logo;
- Início
- Estoque
- Financiamento
- Venda seu carro
- Sobre
- Contato
- botão destacado `Falar no WhatsApp`

Mobile:
- logo;
- botão WhatsApp;
- menu hamburger.

Header deve ficar sticky ao rolar, sem ocupar espaço excessivo.

## 14.2 Hero
Headline sugerida:
**Encontre o carro certo para você.**

Subheadline:
**Consulte nosso estoque e fale direto com um vendedor pelo WhatsApp.**

### Busca principal
Campos rápidos:
- Marca
- Modelo
- Faixa de preço ou preço máximo
- botão **Buscar veículos**

A lista de marcas/modelos deve vir do estoque real.

CTA secundário:
- `Ver todo o estoque`

### Background
Usar fotografia automotiva de alto impacto, mas manter legibilidade e velocidade.

## 14.3 Marcas disponíveis
Mostrar logos ou nomes das marcas existentes **somente se houver veículos ativos daquela marca**.

Ao clicar:
```txt
/estoque?marca=jeep
```

Não manter logos de marcas sem estoque.

## 14.4 Destaques
Grid/carrossel de veículos com `featured=true`.

## 14.5 Explore por tipo
Gerado dinamicamente:
- SUVs
- Sedans
- Hatchs
- Picapes
- etc.

Mostrar somente categorias que tenham veículos.

## 14.6 Bloco de confiança
Pode usar:
- atendimento humano;
- financiamento;
- avaliação de troca;
- procedência/transparência;
- localização física.

Se usar “+700 veículos vendidos”, validar com a loja antes da publicação.

## 14.7 Financiamento
Bloco:
**Quer saber como pode ficar sua parcela?**

CTA:
`Fazer uma simulação`

Não calcular/aprovar crédito no site. Abrir fluxo que coleta algumas informações e envia ao WhatsApp.

## 14.8 Venda/Troca
Bloco:
**Tem um carro na troca?**

CTA:
`Avaliar meu veículo`

## 14.9 Instagram
Bloco simples:
- título
- @indica.automoveis
- botão `Seguir no Instagram`

Evitar integrar feed via API se isso exigir token/backend.

## 14.10 Localização
- endereço;
- botão `Como chegar`;
- mapa somente se puder ser incorporado sem prejudicar performance/privacidade.

## 14.11 Footer
- logo
- navegação
- WhatsApp
- Instagram
- endereço
- política de privacidade
- copyright

---

# 15. Página de estoque — `/estoque`

## Desktop
Layout:
```txt
[FILTROS 280–320px] [RESULTADOS FLEXÍVEIS]
```

## Mobile
- barra de busca
- chips de filtros ativos
- botão `Filtros`
- botão `Ordenar`
- filtros em drawer/bottom sheet
- CTA WhatsApp flutuante opcional

## Cabeçalho da listagem
Mostrar:
- título `Estoque`
- quantidade de veículos encontrados
- ordenação
- filtros ativos
- botão `Limpar filtros`

## Grid
Desktop:
- 3 cards por linha em largura padrão;
- 2 em tablets;
- 1 no mobile.

Não apertar cards demais.

---

# 16. VehicleCard

Cada card deve ter:

1. foto de capa;
2. badge opcional:
   - Destaque
   - Reservado
   - Oferta
3. marca + modelo;
4. versão;
5. ano;
6. quilometragem;
7. câmbio;
8. combustível;
9. preço;
10. CTA principal `Ver detalhes`;
11. CTA WhatsApp `Falar com vendedor`.

### Interações
- card inteiro pode abrir detalhes;
- botão de WhatsApp não deve disparar também a navegação do card;
- estado hover elegante;
- carregamento de imagem lazy;
- aspect-ratio consistente;
- skeleton na primeira renderização, se necessário.

---

# 17. Estado sem resultados

Nunca mostrar apenas “nenhum resultado”.

Mostrar:
**Não encontramos um veículo com esses filtros.**

Ações:
- `Limpar filtros`
- `Ver todo o estoque`
- `Falar com um vendedor`

WhatsApp sugerido:
> Olá! Procurei um veículo no site da Indica Automóveis, mas não encontrei. Estou buscando: [resumo dos filtros]. Vocês conseguem me ajudar?

O resumo dos filtros deve ser gerado automaticamente.

---

# 18. Página de detalhes — `/veiculo/:slug`

Essa é a página mais importante de conversão.

## 18.1 Breadcrumb
```txt
Início > Estoque > Jeep > Renegade
```

## 18.2 Galeria
- imagem principal grande;
- thumbnails;
- navegação anterior/próxima;
- contador `1 / 12`;
- lightbox;
- swipe no mobile;
- zoom controlado;
- não carregar todas as fotos em full-size imediatamente.

## 18.3 Cabeçalho do veículo
- Marca + Modelo
- Versão
- Ano/modelo
- Quilometragem
- Preço
- badge de status
- código do veículo opcional

## 18.4 Ficha rápida
Grid visual:
- ano
- km
- câmbio
- combustível
- carroceria
- cor
- motor
- portas

## 18.5 Destaques
Lista clara.

## 18.6 Opcionais
Organizar em grid para leitura rápida.

## 18.7 Descrição
Texto comercial, sem exageros ou dados inventados.

## 18.8 CTAs principais
Desktop:
- card lateral sticky.

Mobile:
- barra sticky inferior.

Botões:
1. **Falar com vendedor**
2. **Fazer simulação**
3. **Tenho carro na troca**

O CTA primário deve abrir WhatsApp com mensagem contendo o carro.

## 18.9 Veículos semelhantes
Gerar automaticamente com scoring:
1. mesma marca/modelo;
2. mesma carroceria;
3. faixa de preço próxima;
4. ano próximo.

Nunca preencher manualmente.

---

# 19. WhatsApp — arquitetura de conversão

## Base
```txt
https://wa.me/5511987802814?text=<mensagem-url-encoded>
```

Criar função central:

```ts
buildWhatsAppUrl({
  intent,
  vehicle,
  financingData,
  tradeInData,
  utm
})
```

NUNCA espalhar URLs hardcoded em dezenas de componentes.

---

# 20. Templates de WhatsApp

## 20.1 Falar com vendedor — veículo específico

```txt
Olá! Vi este veículo no site da Indica Automóveis e gostaria de mais informações:

🚗 {title}
📅 {yearManufacture}/{yearModel}
🛣️ {mileageKmFormatado}
💰 {priceFormatado}

Link: {currentUrl}

Ele ainda está disponível?
```

## 20.2 Fazer simulação

```txt
Olá! Gostaria de fazer uma simulação de financiamento:

🚗 {title}
💰 Valor anunciado: {priceFormatado}
💵 Entrada aproximada: {entradaOuNaoInformado}
📆 Prazo desejado: {prazoOuNaoInformado}

Link: {currentUrl}

Podem me passar as opções?
```

## 20.3 Tenho carro na troca

```txt
Olá! Tenho interesse neste veículo e gostaria de avaliar meu carro na troca:

🚗 Interesse: {title}

Meu veículo:
Marca/modelo: {tradeMakeModel}
Ano: {tradeYear}
KM aproximada: {tradeMileage}

Link do veículo: {currentUrl}
```

## 20.4 Contato geral

```txt
Olá! Vim pelo site da Indica Automóveis e gostaria de falar com um vendedor.
```

## 20.5 Busca sem resultado

```txt
Olá! Fiz uma busca no site da Indica Automóveis e não encontrei exatamente o que procuro.

Estou buscando:
{filtersSummary}

Vocês têm alguma opção parecida?
```

---

# 21. Modal/formulário de simulação

Não realizar simulação bancária real.

O formulário existe para montar uma conversa de WhatsApp mais qualificada.

Campos:
- veículo selecionado (preenchido automaticamente se veio da página de veículo);
- nome (opcional);
- entrada aproximada;
- prazo desejado:
  - 12x
  - 24x
  - 36x
  - 48x
  - 60x
  - “Quero orientação”
- tem veículo na troca? sim/não.

Botão:
**Continuar no WhatsApp**

Nenhum dado precisa ser salvo em servidor na V1.

---

# 22. Página “Venda seu carro” / troca

Objetivo:
lead para:
- venda;
- avaliação;
- troca.

Campos locais:
- marca/modelo;
- ano;
- quilometragem;
- observações.

CTA:
**Pedir avaliação no WhatsApp**

Gerar mensagem pronta.

Não prometer valor de avaliação no site.

---

# 23. Dados da empresa em arquivo central

Criar:

```ts
// src/config/business.ts
export const business = {
  name: "Indica Automóveis",
  whatsappDisplay: "(11) 98780-2814",
  whatsappE164: "5511987802814",
  instagram: "https://www.instagram.com/indica.automoveis/",
  address: "Av. Ragueb Chohfi, 441, São Paulo, Brazil",
  addressNeedsConfirmation: true
};
```

Qualquer CTA deve consumir esse arquivo.

Não duplicar dados da empresa em vários componentes.

---

# 24. UTM e atribuição de lead

Importante para anúncios.

Ao entrar no site, capturar quando existirem:
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `utm_term`
- `gclid`
- `fbclid`

Persistir em `sessionStorage` por sessão.

Ao montar o WhatsApp, acrescentar discretamente no final:

```txt
Origem: {utm_source}/{utm_campaign}
```

Ou um código compacto, sem poluir a experiência do cliente.

Exemplo:
```txt
Ref: meta | campanha-suv-agosto
```

---

# 25. Analytics pronto, mas não obrigatório

Criar uma pequena camada:

```ts
track(eventName, payload)
```

Eventos:
- `view_home`
- `search_inventory`
- `apply_filter`
- `view_vehicle`
- `click_vehicle_card`
- `click_whatsapp`
- `click_financing`
- `click_trade_in`
- `open_gallery`
- `no_results`

A camada deve funcionar em modo `noop` quando IDs de analytics não estiverem configurados.

`.env.example`:

```env
VITE_GA4_ID=
VITE_META_PIXEL_ID=
VITE_SITE_URL=
```

Não bloquear o projeto se essas variáveis estiverem vazias.

Se scripts de marketing forem ativados, preparar consentimento/privacidade compatível com o uso real de cookies e tracking.

---

# 26. Design system

Criar tokens de design, não valores aleatórios espalhados.

```css
:root {
  --color-bg: ...;
  --color-surface: ...;
  --color-text: ...;
  --color-muted: ...;
  --color-border: ...;
  --color-brand: ...;
  --color-brand-contrast: ...;
  --radius-sm: ...;
  --radius-md: ...;
  --radius-lg: ...;
  --shadow-card: ...;
  --container: 1280px;
}
```

## Direção visual
Misturar:
- limpeza/minimalismo da referência Tesla;
- organização comercial e descoberta da referência Zoomcar;
- identidade própria da Indica Automóveis.

### Evitar
- excesso de gradiente;
- cards gigantes;
- fontes futuristas difíceis;
- neon;
- visual de template genérico;
- 15 cores;
- animações excessivas;
- carrosséis automáticos irritantes.

### Usar
- muito espaço em branco;
- tipografia forte;
- fotos grandes;
- cards claros;
- bordas discretas;
- CTA bem contrastante;
- hierarquia consistente.

---

# 27. Responsividade

Breakpoints podem seguir o sistema escolhido, mas validar manualmente:

- 360 px
- 390 px
- 430 px
- 768 px
- 1024 px
- 1280 px
- 1440 px+

### Mobile é prioridade
Especial atenção:
- filtros;
- galeria;
- CTA sticky;
- botões com área de toque adequada;
- inputs;
- menu;
- velocidade.

---

# 28. Performance

Metas:
- evitar layout shift;
- hero otimizado;
- imagem de card lazy;
- primeira imagem principal com prioridade;
- dimensões de imagem conhecidas;
- code splitting por rota;
- evitar biblioteca pesada para funções simples;
- evitar vídeos automáticos;
- preferir WebP/AVIF quando possível;
- limitar thumbnails de listagem a resoluções menores.

### Organização das fotos
```txt
public/vehicles/<slug>/
```

Ao adicionar fotos:
- manter ordem numérica;
- capa = `01`;
- usar nomes estáveis;
- evitar arquivos de 8–15 MB no deploy;
- gerar versões adequadas para web quando necessário.

---

# 29. SEO técnico — importante para cada carro

Mesmo sendo React/Vite estático, cada veículo deve ter URL estável:

```txt
/veiculo/<slug>
```

## Meta por veículo
- `<title>`
- meta description
- canonical
- Open Graph title
- Open Graph description
- Open Graph image
- Twitter card
- JSON-LD

## Schema estruturado
Usar dados compatíveis com:
- `Vehicle`
- `Offer`
- `AutoDealer` / `LocalBusiness`

Não inventar dados que não existam no cadastro.

---

# 30. Prerender estático dos veículos

Esse requisito é importante porque previews de links e SEO não devem depender apenas de JavaScript executado no cliente.

Criar `scripts/prerender-vehicles.mjs`.

Após `vite build`:

1. ler `dist/index.html`;
2. ler `vehicles.json`;
3. para cada veículo publicável:
   - criar `dist/veiculo/<slug>/index.html`;
   - injetar `<title>`;
   - injetar meta description;
   - injetar canonical;
   - injetar OG image;
   - injetar JSON-LD;
4. manter o mesmo bundle React;
5. ao abrir a rota, React assume a página normalmente.

Isso permite continuar com React/Vite + Cloudflare Pages sem exigir servidor SSR.

---

# 31. Sitemap automático

Criar no build:

```txt
/sitemap.xml
```

Incluir:
- home;
- estoque;
- páginas institucionais relevantes;
- todos os veículos `available` e `reserved`.

Veículos `draft` não entram.

Para `sold`, decidir:
- manter por algum período se a página continuar útil;
- ou retirar do sitemap.

O processo deve ser automático.

---

# 32. robots.txt

Criar versão padrão permitindo indexação das áreas públicas.

Não indexar nada que venha a ser criado no futuro como:
- admin;
- preview interno;
- drafts.

---

# 33. Comportamento de veículo vendido

Ao marcar:

```json
"status": "sold"
```

O carro:
- não aparece no estoque normal;
- não aparece nos destaques;
- sua URL pode continuar viva;
- mostra aviso:
  **Este veículo já foi vendido.**
- mostra veículos semelhantes;
- CTA:
  **Quero encontrar um parecido**

WhatsApp:
```txt
Olá! Vi no site que o {title} foi vendido. Vocês têm outro parecido?
```

Isso evita links mortos de anúncios/posts antigos.

---

# 34. “Adicionar carro” — protocolo obrigatório para o agente

Sempre que o usuário disser algo como:

> “Adicione esse carro ao site”

o agente deve seguir esta ordem:

1. receber/identificar os dados;
2. criar `slug` único;
3. criar `id` único;
4. criar pasta de imagens;
5. organizar imagens em ordem;
6. cadastrar veículo em `vehicles.json`;
7. não editar manualmente filtros;
8. validar schema;
9. garantir que marca/modelo aparecem automaticamente nos facets;
10. garantir que o carro aparece na busca textual;
11. gerar/atualizar SEO;
12. gerar/atualizar sitemap;
13. testar a rota do detalhe;
14. testar CTAs de WhatsApp;
15. rodar build;
16. corrigir qualquer erro antes de encerrar.

### Se algum dado estiver ausente
Não inventar informação técnica.

Pode:
- deixar campo opcional ausente;
- perguntar ao usuário quando o dado for essencial.

### Campos essenciais mínimos
- marca;
- modelo;
- ano;
- preço;
- km;
- ao menos 1 imagem.

---

# 35. Automação natural dos filtros

O agente deve escrever testes para garantir:

### Caso 1
Adicionar:
```txt
Toyota Corolla
```
Resultado:
- `Toyota` surge no filtro de marca.

### Caso 2
Selecionar:
```txt
Marca = Toyota
```
Resultado:
- filtro de modelo mostra somente modelos Toyota ativos.

### Caso 3
Remover o último veículo Toyota
Resultado:
- Toyota deixa de aparecer no filtro.

### Caso 4
Adicionar ano novo
Resultado:
- range de anos se ajusta.

### Caso 5
Adicionar veículo mais caro
Resultado:
- faixa máxima de preço se ajusta.

Nada disso deve exigir alteração em listas fixas.

---

# 36. Busca rápida no hero

Ao selecionar:
```txt
Marca: Jeep
Modelo: Renegade
```

e clicar `Buscar veículos`, navegar para:

```txt
/estoque?marca=jeep&modelo=renegade
```

Nunca manter uma lógica separada de busca na home.

A home deve usar o mesmo mecanismo de filtros do estoque.

---

# 37. Similaridade de veículos

Criar helper:

```ts
getSimilarVehicles(currentVehicle, inventory, limit = 4)
```

Score sugerido:
- +5 mesma marca
- +5 mesmo modelo
- +4 mesma carroceria
- +3 preço dentro de ±20%
- +2 ano dentro de ±2 anos
- +1 mesmo combustível

Excluir:
- o próprio veículo;
- `draft`;
- `sold` da lista principal.

---

# 38. Acessibilidade

Obrigatório:
- `alt` descritivo em fotos;
- navegação por teclado;
- foco visível;
- contraste adequado;
- aria-label em botões de ícone;
- formulários com label;
- erros de validação compreensíveis;
- modal/lightbox com focus trap;
- ESC fecha modal.

---

# 39. Estados de UI

Implementar:
- loading;
- empty;
- error;
- no results;
- veículo vendido;
- veículo reservado;
- imagem indisponível;
- rota inexistente.

Não permitir telas quebradas por dados faltando.

---

# 40. Erros de imagem

Criar fallback visual elegante.

Se uma foto falhar:
- mostrar placeholder automotivo neutro;
- não quebrar o card;
- manter dimensões.

---

# 41. Segurança e privacidade

Como V1 é estática:
- nenhum segredo no front-end;
- nenhum token privado em `VITE_*`;
- não expor chaves de API;
- não coletar CPF;
- não coletar documentos;
- não armazenar dados financeiros;
- simulação serve apenas para iniciar WhatsApp.

---

# 42. Cloudflare Pages

Configuração esperada:

```txt
Production branch: main
Build command: npm run build
Build output directory: dist
```

Cloudflare Pages atualmente suporta o fluxo React/Vite estático e deploy por Git.

### Compatibilidade
O projeto deve:
- funcionar sem Node server em produção;
- não depender de `localhost`;
- não depender de Express;
- usar paths compatíveis com Pages;
- funcionar ao atualizar uma URL de veículo diretamente.

O script de prerender ajuda a garantir as rotas importantes como arquivos estáticos reais.

---

# 43. Headers recomendados

Criar `public/_headers` com segurança básica, sem quebrar assets/analytics.

Exemplo a adaptar:

```txt
/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
```

Não usar CSP extremamente restritiva sem testar WhatsApp, imagens, analytics e embeds.

---

# 44. Configuração de domínio

Não assumir domínio final.

Usar:
```env
VITE_SITE_URL=
```

Enquanto não houver domínio:
- dev usa `window.location.origin`;
- canonical deve ser gerado somente corretamente quando `VITE_SITE_URL` estiver definido.

Não hardcodar `pages.dev` como canonical final.

---

# 45. Página de contato

Mostrar:
- WhatsApp;
- Instagram;
- endereço;
- horários **somente quando forem informados**;
- botão `Falar no WhatsApp`;
- botão `Ver no mapa`.

Não inventar telefone secundário, horário ou e-mail.

---

# 46. Página Sobre

Estrutura inicial:
- quem é a Indica Automóveis;
- proposta de transparência;
- experiência;
- atendimento;
- localização;
- CTA para estoque;
- CTA WhatsApp.

Se não houver texto institucional definitivo, usar conteúdo curto, neutro e facilmente editável.

---

# 47. Conteúdo editável

Centralizar textos de negócio, sempre que fizer sentido, em:
```txt
src/config/
```

Evitar dezenas de strings críticas espalhadas em JSX.

---

# 48. Feature flags simples

Opcional:

```ts
export const features = {
  financing: true,
  tradeIn: true,
  instagram: true,
  analytics: false,
  favorites: false
}
```

Isso facilita ativar/desativar blocos.

---

# 49. Favoritos

**Não é obrigatório na V1.**

Se for implementado:
- apenas `localStorage`;
- sem login;
- ícone de coração;
- página/área “Favoritos” opcional.

Não priorizar isso antes da busca, detalhe e WhatsApp.

---

# 50. Comparador de veículos

**Não implementar na primeira entrega**, salvo se todo o core estiver impecável.

Pode ficar planejado para V2.

---

# 51. Checklist funcional da V1

Antes de considerar o projeto pronto:

- [ ] React + Vite + TypeScript
- [ ] Cloudflare Pages compatível
- [ ] home pronta
- [ ] estoque pronto
- [ ] busca textual pronta
- [ ] filtros derivados dos dados
- [ ] marca -> modelo dependente
- [ ] URL de filtros
- [ ] ordenação
- [ ] cards
- [ ] detalhes
- [ ] galeria
- [ ] WhatsApp geral
- [ ] WhatsApp por veículo
- [ ] WhatsApp de simulação
- [ ] WhatsApp de troca
- [ ] estado sem resultados
- [ ] veículo vendido
- [ ] similares
- [ ] mobile
- [ ] acessibilidade
- [ ] validação de dados
- [ ] SEO por veículo
- [ ] prerender das rotas de veículo
- [ ] sitemap automático
- [ ] robots.txt
- [ ] dados da empresa centralizados
- [ ] UTM capture
- [ ] analytics adapter
- [ ] build sem erros

---

# 52. Testes mínimos

Usar testes unitários para lógica crítica.

Cobrir:
- filtro por marca;
- filtro por modelo;
- filtro dependente;
- faixa de preço;
- ano;
- km;
- normalização de texto;
- ordenação;
- `buildWhatsAppUrl`;
- `getSimilarVehicles`;
- exclusão de `draft`;
- exclusão de `sold` no estoque.

Testes E2E são desejáveis para:
1. Home -> busca -> estoque
2. Estoque -> veículo
3. Veículo -> WhatsApp
4. Simulação -> WhatsApp
5. mobile filter drawer

---

# 53. Mensagens de CTA recomendadas

Usar variações coerentes:

### Primárias
- Falar com vendedor
- Consultar disponibilidade
- Fazer simulação
- Quero esse carro
- Entrar em contato

### Secundárias
- Ver detalhes
- Ver fotos
- Tenho carro na troca
- Ver veículos semelhantes
- Ver todo o estoque

Evitar dezenas de frases diferentes sem padrão.

---

# 54. UX de CTA por contexto

## Home
Primário:
`Buscar veículos`

Secundário:
`Falar no WhatsApp`

## Card
Primário:
`Ver detalhes`

Secundário:
`Falar com vendedor`

## Detalhe
Primário:
`Falar com vendedor`

Secundários:
`Fazer simulação`
`Tenho carro na troca`

## Sem resultado
Primário:
`Falar com vendedor`

## Veículo vendido
Primário:
`Quero encontrar um parecido`

---

# 55. Não cometer estes erros

1. Não criar filtro com marcas fixas.
2. Não criar modelo fixo.
3. Não duplicar lógica de filtro entre Home e Estoque.
4. Não hardcodar WhatsApp em vários componentes.
5. Não criar checkout.
6. Não adicionar preço de parcela fictício.
7. Não inventar aprovação de financiamento.
8. Não inventar características do carro.
9. Não usar 100% das fotos em resolução total no grid.
10. Não perder filtros ao atualizar a página.
11. Não deixar CTA genérico sem identificar o carro.
12. Não abrir WhatsApp com mensagem vazia quando existe contexto.
13. Não publicar `draft`.
14. Não apagar URL de carro vendido imediatamente.
15. Não depender de backend para o core.
16. Não criar um design clone da Webmotors/Tesla.
17. Não sacrificar mobile.
18. Não usar endereço diferente do arquivo de configuração.
19. Não colocar IDs secretos no código.
20. Não finalizar sem rodar o build.

---

# 56. Critérios de aceitação

## Cenário A — novo carro
Dado que o usuário envia um novo Honda Civic:
- o agente cadastra o Civic;
- Honda entra na marca se ainda não existir;
- Civic entra nos modelos Honda;
- o ano atualiza o range se necessário;
- o preço atualiza a faixa;
- o veículo aparece em busca;
- a página `/veiculo/<slug>` funciona;
- WhatsApp contém o Civic correto.

## Cenário B — busca
Usuário busca:
```txt
suv automatico até 100 mil
```

O sistema deve permitir combinar filtros equivalentes e mostrar somente os carros compatíveis.

## Cenário C — compartilhamento
Usuário copia:
```txt
/estoque?marca=jeep&precoMax=100000
```

Outra pessoa abre e vê os mesmos filtros.

## Cenário D — contato
Usuário abre um carro e clica:
`Falar com vendedor`

WhatsApp abre para:
```txt
5511987802814
```

com mensagem contendo:
- veículo;
- preço;
- ano;
- km;
- URL.

## Cenário E — sold
Carro muda para `sold`:
- some da listagem;
- URL antiga informa vendido;
- similares aparecem;
- CTA oferece encontrar parecido.

---

# 57. Entrega técnica esperada do agente

Ao terminar a primeira implementação, retornar ao usuário:

1. resumo do que foi implementado;
2. árvore principal de arquivos;
3. como rodar localmente;
4. como cadastrar um novo veículo;
5. como trocar dados da loja;
6. como alterar WhatsApp;
7. como publicar no Cloudflare Pages;
8. quais itens ficaram como TODO;
9. build final validado.

Comandos esperados:

```bash
npm install
npm run dev
npm run build
npm run preview
```

---

# 58. Ordem de execução recomendada ao agente

## Fase 1 — Base
1. Vite/React/TS
2. router
3. design tokens
4. layout/header/footer
5. business config

## Fase 2 — Domínio
6. vehicle schema
7. sample inventory
8. repository
9. facet builder
10. search/filter engine

## Fase 3 — Páginas core
11. home
12. estoque
13. card
14. detalhe
15. galeria

## Fase 4 — Conversão
16. WhatsApp service
17. CTAs
18. financiamento
19. troca
20. no-results

## Fase 5 — SEO/performance
21. metadata
22. prerender
23. sitemap
24. images
25. route splitting

## Fase 6 — Qualidade
26. tests
27. responsive QA
28. accessibility
29. build
30. Cloudflare readiness

---

# 59. Dados de exemplo

Adicionar **apenas 3 a 6 veículos fictícios claramente marcados como DEMO** para desenvolver a UI, e centralizá-los em `vehicles.json`.

Eles devem ser removíveis facilmente quando o estoque real chegar.

Não criar dezenas de carros falsos.

Um banner em dev pode indicar:
```txt
Dados de demonstração
```

Nunca publicar dados fictícios como se fossem estoque real.

---

# 60. Preparação para futura evolução

A V1 deve ser estática e simples.

Mas a interface do repositório deve permitir futuramente:

```ts
interface VehicleRepository {
  getAll(): Promise<Vehicle[]>;
  getBySlug(slug: string): Promise<Vehicle | null>;
}
```

V1:
```txt
LocalJsonVehicleRepository
```

Futuro:
```txt
ApiVehicleRepository
D1VehicleRepository
SupabaseVehicleRepository
```

A UI não deve saber de onde os dados vêm.

---

# 61. Cloudflare Pages Free — restrições de projeto

Manter a solução adequada ao plano gratuito:
- estático sempre que possível;
- sem servidor persistente;
- builds enxutos;
- sem processamento pesado em runtime;
- imagens otimizadas;
- sem dependência de infraestrutura paga.

No momento do planejamento, a documentação oficial do Cloudflare Pages informa para o plano Free:
- 1 build concorrente;
- até 500 builds/mês;
- limite de arquivos por site conforme documentação vigente.

Não usar esses limites como desculpa para arquitetura ruim; apenas manter o projeto enxuto.

---

# 62. Ponto de controle antes de publicar

Antes de produção, confirmar:
- [ ] número do endereço: 441 ou 439
- [ ] logotipo final
- [ ] paleta final da Indica
- [ ] domínio final
- [ ] horário de funcionamento
- [ ] políticas/termos
- [ ] texto institucional
- [ ] estoque real
- [ ] se “+700 veículos vendidos” continuará sendo usado
- [ ] analytics/pixel
- [ ] imagens OG padrão

---

# 63. Instrução final ao agente

**Implemente. Não responda apenas com explicações.**

Quando houver decisão técnica pequena não especificada, escolha a opção:
1. mais simples;
2. mais performática;
3. mais fácil de manter;
4. compatível com React/Vite + Cloudflare Pages Free;
5. que preserve o objetivo de gerar WhatsApp leads.

O projeto deve parecer um produto real de uma loja automotiva consolidada, não um template.

A prioridade absoluta é:

```txt
DESCOBRIR VEÍCULO
      ↓
ENCONTRAR INFORMAÇÕES
      ↓
GANHAR CONFIANÇA
      ↓
CLICAR NO WHATSAPP
      ↓
LEAD QUALIFICADO
```

**Fim da especificação.**
