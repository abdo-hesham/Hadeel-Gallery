// Debug helper: scroll to positions and dump element rects/styles.
// Usage: node scripts/probe.mjs <url> "<selector>" y1 y2 ...
import { chromium } from 'playwright-core';
const [url, sel, ...ys] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' });
const p = await b.newPage({ viewport: { width: 1440, height: 860 } });
await p.goto(url, { waitUntil: 'networkidle' });
await p.waitForTimeout(2000);
for (const y of ys.map(Number)) {
  await p.evaluate(async (yy) => { window.scrollTo(0, yy); await new Promise((r) => setTimeout(r, 1800)); }, y);
  const r = await p.evaluate((s) => [...document.querySelectorAll(s)].map((el) => {
    const c = getComputedStyle(el); const r = el.getBoundingClientRect();
    return { top: Math.round(r.top), left: Math.round(r.left), w: Math.round(r.width), h: Math.round(r.height), opacity: c.opacity, transform: c.transform, vis: c.visibility };
  }), sel);
  console.log(y, JSON.stringify(r));
}
await b.close();
