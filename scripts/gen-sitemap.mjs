// Writes public/sitemap.xml from the routes and the artwork catalog.
// Run: node scripts/gen-sitemap.mjs   (also runs before `npm run build`)
// Set SITE_URL to override the domain.
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { artworks } from '../src/data/catalog.mjs';

const SITE = (process.env.SITE_URL || 'https://lillyboutique.com').replace(/\/$/, '');
const today = new Date().toISOString().slice(0, 10);

const pages = [
  { loc: '/', priority: '1.0', changefreq: 'weekly' },
  { loc: '/shop', priority: '0.9', changefreq: 'weekly' },
  ...artworks.map((a) => ({ loc: `/shop?art=${a.id}`, priority: '0.7', changefreq: 'monthly' })),
  { loc: '/terms', priority: '0.3', changefreq: 'yearly' },
  { loc: '/privacy', priority: '0.3', changefreq: 'yearly' },
];

const esc = (s) => s.replace(/&/g, '&amp;');
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((p) => `  <url>
    <loc>${esc(SITE + p.loc)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

writeFileSync(fileURLToPath(new URL('../public/sitemap.xml', import.meta.url)), xml);
console.log(`sitemap: ${pages.length} urls for ${SITE}`);

// llms.txt (https://llmstxt.org): a short Markdown map of the site for AI agents.
const available = artworks.filter((a) => a.status === 'available');
const llms = `# Lilly's Boutique

> Online gallery and shop for original paintings by the artist Hadeel, 2024 to 2026. Every work is one of a kind; nothing is a print.

## Pages

- [Gallery](${SITE}/): the home page, a scroll-through gallery of the collection and the studio
- [Works](${SITE}/shop): every painting with medium, size, year and availability
- [Terms and Conditions](${SITE}/terms)
- [Privacy Policy](${SITE}/privacy)

## Available works

${available.map((a) => `- [${a.title}](${SITE}/shop?art=${a.id}): ${a.medium}, ${a.width} × ${a.height} cm, ${a.year}`).join('\n')}
`;
writeFileSync(fileURLToPath(new URL('../public/llms.txt', import.meta.url)), llms);
console.log(`llms.txt: ${available.length} available works`);
