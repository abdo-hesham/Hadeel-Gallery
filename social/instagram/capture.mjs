// Captures real site screens used inside the Instagram carousel.
// Needs the dev server on :5179. Usage: node social/instagram/capture.mjs
import { chromium } from 'playwright-core';
import { fileURLToPath } from 'node:url';

const base = process.env.BASE || 'http://localhost:5179';
const out = fileURLToPath(new URL('./shots/', import.meta.url));
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });

const shots = [
  { name: 'desk-home', path: '/', vw: 1440, vh: 900, y: 0 },
  { name: 'desk-home-works', path: '/', vw: 1440, vh: 900, y: 2600 },
  { name: 'desk-shop', path: '/shop', vw: 1440, vh: 900, y: 0 },
  { name: 'desk-shop-grid', path: '/shop', vw: 1440, vh: 900, y: 700 },
  { name: 'mob-home', path: '/', vw: 390, vh: 844, y: 0 },
  { name: 'mob-shop', path: '/shop', vw: 390, vh: 844, y: 420 },
];

for (const s of shots) {
  const page = await browser.newPage({ viewport: { width: s.vw, height: s.vh }, deviceScaleFactor: 2 });
  await page.goto(base + s.path, { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(3500);
  await page.evaluate(async (y) => { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 2200)); }, s.y);
  await page.screenshot({ path: out + s.name + '.png' });
  await page.close();
  console.log('saved', s.name);
}
await browser.close();
