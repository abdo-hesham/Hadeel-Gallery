import { chromium } from 'playwright-core';
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:5179/', { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);
const info = await page.evaluate(() => {
  const secs = [...document.querySelectorAll('main.home > *, .pin-spacer')].map(el => ({ cls: el.className, top: Math.round(el.getBoundingClientRect().top + window.scrollY), h: Math.round(el.offsetHeight) }));
  return { height: document.documentElement.scrollHeight, secs };
});
console.log(JSON.stringify(info, null, 1));
await browser.close();
