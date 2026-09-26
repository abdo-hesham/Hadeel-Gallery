// Captures real site screens used inside the Instagram carousel.
// Needs the dev server on :5179. Usage: node social/instagram/capture.mjs
import { chromium } from 'playwright-core';
import { fileURLToPath } from 'node:url';

const base = process.env.BASE || 'http://localhost:5179';
const out = fileURLToPath(new URL('./shots/', import.meta.url));
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });

// y: scroll offset; 'bottom' scrolls to the footer.
const shots = [
  { name: 'desk-home', path: '/', vw: 1440, vh: 900, y: 0 },
  { name: 'desk-home-tiles', path: '/', vw: 1440, vh: 900, y: 800 },
  { name: 'desk-footer', path: '/', vw: 1440, vh: 900, y: 'bottom' },
  { name: 'desk-shop-top', path: '/shop', vw: 1440, vh: 900, y: 0 },
  { name: 'mob-home', path: '/', vw: 390, vh: 844, y: 0 },
];

for (const s of shots) {
  const page = await browser.newPage({ viewport: { width: s.vw, height: s.vh }, deviceScaleFactor: 2 });
  await page.goto(base + s.path, { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(3500);
  if (s.y === 'bottom') {
    // Step down so scroll-triggered sections finish, then settle at the end.
    await page.evaluate(async () => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += 700) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo(0, document.documentElement.scrollHeight);
      await new Promise((r) => setTimeout(r, 2500));
    });
  } else {
    await page.evaluate(async (y) => { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 2500)); }, s.y);
  }
  await page.screenshot({ path: out + s.name + '.png' });
  await page.close();
  console.log('saved', s.name);
}
await browser.close();
