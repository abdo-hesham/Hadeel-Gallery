// Visual QA helper: scrolls through a page and saves frames.
// Usage: node scripts/shots.mjs <url> <outDir> [scrollPositions...]
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';

const [url = 'http://localhost:5179/', out = 'shots', ...stops] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', headless: true });
const [vw, vh] = (process.env.VIEWPORT || '1440x860').split('x').map(Number);
const page = await browser.newPage({ viewport: { width: vw, height: vh } });
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
if (process.env.CART) {
  await page.addInitScript((ids) => localStorage.setItem('hadeel.cart', JSON.stringify(ids)), process.env.CART.split(','));
}
await page.goto(url, { waitUntil: 'networkidle' });
if (process.env.FILL) {
  // Fill every text input with dummy data and submit the form (demo checkout).
  await page.evaluate(() => {
    const set = (el, v) => {
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
      setter.call(el, v);
      el.dispatchEvent(new Event('input', { bubbles: true }));
    };
    document.querySelectorAll('input:not([type=radio])').forEach((el) => set(el, el.type === 'email' ? 'buyer@example.com' : el.autocomplete === 'name' ? 'Test Buyer' : '1234'));
  });
  await page.click('button[type=submit]');
  await page.waitForTimeout(4500);
}
if (process.env.CLICK) {
  await page.click(process.env.CLICK);
  await page.waitForTimeout(1800);
}
await page.waitForTimeout(2500);
const positions = stops.length ? stops.map(Number) : [0];
for (const y of positions) {
  await page.evaluate(async (yy) => {
    window.scrollTo(0, yy);
    await new Promise((r) => setTimeout(r, 1600));
  }, y);
  await page.screenshot({ path: `${out}/y${String(y).padStart(5, '0')}.png` });
}
console.log(JSON.stringify({ height: await page.evaluate(() => document.documentElement.scrollHeight), errors }));
await browser.close();
