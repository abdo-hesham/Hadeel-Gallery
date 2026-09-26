// Deterministic desktop scroll capture: fake clock, 30fps, frame-by-frame screenshots.
// Usage: node video/capture.mjs [maxFrames]
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';

const FPS = 30, VW = 1440, VH = 900;
const OUT = 'video/capture';
const maxFrames = Number(process.argv[2] || Infinity);
mkdirSync(OUT, { recursive: true });

// [targetScrollY, seconds] — scroll from previous target to this one over seconds.
const SEGMENTS = [
  [0, 2.5],       // hold on hero intro
  [3420, 10],     // hero pinned collage
  [6418, 7],      // unpin + selected works
  [7207, 4.5],    // statement (clip-path reveal needs ~1.4s on screen)
  [10087, 6],     // featured (pinned zoom)
  [14407, 8],     // studio (pinned)
  [17113, 8],     // available works (card reveals 1.2s each)
  [17543, 3],     // closing + footer
  [17543, 2.5],   // hold end
];
const smooth = (t) => t * t * (3 - 2 * t);
const ease = (t) => 0.55 * t + 0.45 * smooth(t);

const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const page = await browser.newPage({ viewport: { width: VW, height: VH }, deviceScaleFactor: 1 });
await page.clock.install({ time: new Date('2026-09-25T12:00:00Z') });
await page.addInitScript(() => {
  document.documentElement.classList.remove('has-cursor');
  // Force every image eager so nothing waits for lazy-load during the scroll.
  const desc = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'loading');
  Object.defineProperty(HTMLImageElement.prototype, 'loading', { get() { return 'eager'; }, set() {}, configurable: true });
  new MutationObserver(() => document.querySelectorAll('img[loading]').forEach((i) => i.removeAttribute('loading')))
    .observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['loading'] });
});
await page.goto('http://localhost:5179/', { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
// Hero tiles defer their src until first scroll/keydown intent. Wake them without scrolling.
await page.evaluate(() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Shift' })));
for (let i = 0; i < 100; i++) {
  const ok = await page.evaluate(() => [...document.querySelectorAll('.hero-tile img')].every((im) => im.getAttribute('src')));
  if (ok) break;
  await page.clock.runFor(16);
  await page.waitForTimeout(50);
}
// Wait until every image on the page is fully loaded and decoded.
await page.evaluate(async () => {
  document.querySelectorAll('img[loading]').forEach((i) => i.removeAttribute('loading'));
  await Promise.all([...document.images].map((i) => i.decode().catch(() => {})));
});
const imgs = await page.evaluate(() => [...document.images].map((i) => [i.currentSrc.split('/').pop(), i.complete, i.naturalWidth]));
console.log('images', imgs.length, 'incomplete', imgs.filter((x) => !x[1] || !x[2]).length);
await page.clock.runFor(400);

let frame = 0, prevY = 0;
const step = 1000 / FPS;
for (const [target, secs] of SEGMENTS) {
  const n = Math.round(secs * FPS);
  for (let i = 1; i <= n; i++) {
    if (frame >= maxFrames) break;
    const y = Math.round(prevY + (target - prevY) * ease(i / n));
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.clock.runFor(step);
    await page.screenshot({ path: `${OUT}/f${String(frame).padStart(5, '0')}.jpg`, type: 'jpeg', quality: 92 });
    frame++;
    if (frame % 60 === 0) console.log('frame', frame, 'y', y);
  }
  prevY = target;
  if (frame >= maxFrames) break;
}
console.log('done frames', frame);
await browser.close();
