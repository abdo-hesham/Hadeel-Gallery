// Renders each .slide in slides.html to a 1080x1350 PNG (Instagram 4:5).
// Usage: node social/instagram/render.mjs
import { chromium } from 'playwright-core';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { mkdirSync } from 'node:fs';

const dir = fileURLToPath(new URL('.', import.meta.url));
const out = dir + 'out/';
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const page = await browser.newPage({ viewport: { width: 1200, height: 1400 }, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(dir + 'slides.html').href, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(500);
const slides = await page.$$('.slide');
for (const [i, el] of slides.entries()) {
  const name = `lillys-boutique-carousel-${String(i + 1).padStart(2, '0')}.png`;
  await el.screenshot({ path: out + name });
  console.log('saved', name);
}
await browser.close();
