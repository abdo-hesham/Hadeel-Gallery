// Generates painterly placeholder images for artworks and studio shots.
// Pure pixel math in JS (no SVG filters), encoded to WebP by sharp.
// Run: node scripts/gen-art.mjs
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { studioShots } from '../src/data/catalog.mjs';

const OUT = fileURLToPath(new URL('../public/art/', import.meta.url));
mkdirSync(OUT, { recursive: true });

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const smooth = (t) => t * t * (3 - 2 * t);

// Seeded value noise with fractal octaves.
function makeNoise(seed) {
  const rand = mulberry32(seed);
  const N = 256;
  const grid = new Float32Array(N * N);
  for (let i = 0; i < grid.length; i++) grid[i] = rand();
  const at = (x, y) => grid[((y & (N - 1)) * N) + (x & (N - 1))];
  const base = (x, y) => {
    const x0 = Math.floor(x), y0 = Math.floor(y);
    const fx = smooth(x - x0), fy = smooth(y - y0);
    const a = at(x0, y0), b = at(x0 + 1, y0), c = at(x0, y0 + 1), d = at(x0 + 1, y0 + 1);
    return (a + (b - a) * fx) + ((c + (d - c) * fx) - (a + (b - a) * fx)) * fy;
  };
  return (x, y, oct = 3) => {
    let v = 0, amp = 1, f = 1, sum = 0;
    for (let o = 0; o < oct; o++) { v += base(x * f, y * f) * amp; sum += amp; amp *= 0.5; f *= 2; }
    return v / sum;
  };
}

function paint({ w, h, palette, seed, dark = false }) {
  const rand = mulberry32(seed);
  const noise = makeNoise(seed * 7 + 1);
  const [bgA, bgB, ...inks] = palette.map(hex);
  const pick = () => inks[Math.floor(rand() * inks.length)];
  const px = new Float32Array(w * h * 3);

  // Background gradient with a gentle domain warp.
  const ang = rand() * Math.PI * 2, cx = Math.cos(ang), cy = Math.sin(ang);
  const scale = 1 / Math.max(w, h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const n = noise(x * scale * 3, y * scale * 3, 3) - 0.5;
      let t = ((x - w / 2) * cx + (y - h / 2) * cy) * scale + 0.5 + n * 0.5;
      t = Math.min(1, Math.max(0, t));
      const i = (y * w + x) * 3;
      px[i] = bgA[0] + (bgB[0] - bgA[0]) * t;
      px[i + 1] = bgA[1] + (bgB[1] - bgA[1]) * t;
      px[i + 2] = bgA[2] + (bgB[2] - bgA[2]) * t;
    }
  }

  // Soft, ragged colour fields.
  const blobs = [];
  const blobCount = dark ? 3 : 5 + Math.floor(rand() * 4);
  for (let i = 0; i < blobCount; i++) {
    blobs.push({ x: rand() * w, y: rand() * h, rx: w * (0.12 + rand() * 0.3), ry: h * (0.1 + rand() * 0.28), rot: rand() * Math.PI, c: pick(), a: 0.55 + rand() * 0.4, ns: 40 + rand() * 60, seed: rand() * 100 });
  }
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 3;
      for (const b of blobs) {
        const wx = (noise(x * scale * 4 + b.seed, y * scale * 4, 2) - 0.5) * b.ns * 2;
        const wy = (noise(x * scale * 4, y * scale * 4 + b.seed, 2) - 0.5) * b.ns * 2;
        const dx = x + wx - b.x, dy = y + wy - b.y;
        const rx = dx * Math.cos(b.rot) + dy * Math.sin(b.rot);
        const ry = -dx * Math.sin(b.rot) + dy * Math.cos(b.rot);
        // Ragged edge: high-frequency noise pushes the threshold around.
        const d = (rx * rx) / (b.rx * b.rx) + (ry * ry) / (b.ry * b.ry)
          + (noise(x * scale * 22 + b.seed, y * scale * 22, 3) - 0.5) * 0.5;
        if (d < 1.06) {
          const edge = d < 0.94 ? 1 : 1 - (d - 0.94) / 0.12;
          // Body texture: dry-brush density variation.
          const body = 0.75 + noise(x * scale * 9, y * scale * 9 + b.seed, 2) * 0.35;
          const a = Math.min(1, b.a * edge * body);
          px[i] += (b.c[0] - px[i]) * a;
          px[i + 1] += (b.c[1] - px[i + 1]) * a;
          px[i + 2] += (b.c[2] - px[i + 2]) * a;
        }
      }
    }
  }

  // Palette-knife scrapes: rotated bars with directional streaks and a hard edge.
  const knifeCount = dark ? 1 : 2 + Math.floor(rand() * 2);
  for (let k = 0; k < knifeCount; k++) {
    const kx = rand() * w, ky = rand() * h, rot = rand() * Math.PI;
    const len = w * (0.25 + rand() * 0.4), wid = w * (0.04 + rand() * 0.1);
    const c = pick(), a0 = 0.6 + rand() * 0.35;
    const cs = Math.cos(rot), sn = Math.sin(rot);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const dx = x - kx, dy = y - ky;
        const u = dx * cs + dy * sn, v = -dx * sn + dy * cs;
        if (Math.abs(u) > len / 2 || Math.abs(v) > wid / 2) continue;
        const streak = noise(v * 0.35 + k * 50, u * 0.01, 2);
        const fade = 1 - Math.abs(u) / (len / 2);
        const a = a0 * Math.max(0, (streak - 0.25) * 1.6) * Math.min(1, fade * 3);
        if (a <= 0) continue;
        const i = (y * w + x) * 3;
        px[i] += (c[0] - px[i]) * a;
        px[i + 1] += (c[1] - px[i + 1]) * a;
        px[i + 2] += (c[2] - px[i + 2]) * a;
      }
    }
  }

  // Brush strokes: cubic beziers stamped with bristled discs, radius wobbles,
  // stamps spaced so paint does not over-accumulate into a soft blur.
  const strokeCount = dark ? 4 : 7 + Math.floor(rand() * 6);
  for (let s = 0; s < strokeCount; s++) {
    const p = Array.from({ length: 4 }, () => [rand() * w, rand() * h]);
    const c = pick();
    const baseR = w * (0.008 + rand() * 0.04);
    const alpha = 0.55 + rand() * 0.45;
    const steps = 600;
    let lastX = -1e9, lastY = -1e9, prevX = null, prevY = null, arc = 0;
    for (let k = 0; k <= steps; k++) {
      const t = k / steps, u = 1 - t;
      const bx = u * u * u * p[0][0] + 3 * u * u * t * p[1][0] + 3 * u * t * t * p[2][0] + t * t * t * p[3][0];
      const by = u * u * u * p[0][1] + 3 * u * u * t * p[1][1] + 3 * u * t * t * p[2][1] + t * t * t * p[3][1];
      if (prevX !== null) arc += Math.hypot(bx - prevX, by - prevY);
      // Tangent for bristle streaks that run along the stroke.
      let tx = prevX === null ? 1 : bx - prevX, ty = prevX === null ? 0 : by - prevY;
      const tl = Math.hypot(tx, ty) || 1; tx /= tl; ty /= tl;
      prevX = bx; prevY = by;
      const r = baseR * (0.5 + noise(t * 10 + s, s * 3, 2) * 1.0) * (1 - t * 0.5);
      if (Math.hypot(bx - lastX, by - lastY) < r * 0.3) continue;
      lastX = bx; lastY = by;
      const r2 = r * r;
      const x0 = Math.max(0, Math.floor(bx - r)), x1 = Math.min(w - 1, Math.ceil(bx + r));
      const y0 = Math.max(0, Math.floor(by - r)), y1 = Math.min(h - 1, Math.ceil(by + r));
      for (let y = y0; y <= y1; y++) {
        for (let x = x0; x <= x1; x++) {
          const dx = x - bx, dy = y - by, d2 = dx * dx + dy * dy;
          if (d2 > r2) continue;
          const along = dx * tx + dy * ty, perp = -dx * ty + dy * tx;
          // Bristle texture: high frequency across the stroke, low along it.
          const bristle = noise((perp + s * 97) * 0.3, (arc + along) * 0.012 + s, 2);
          if (bristle < 0.36) continue;
          const e = 1 - d2 / r2;
          const a = alpha * Math.min(1, e * 4) * Math.min(1, (bristle - 0.36) * 4) * 0.5;
          const i = (y * w + x) * 3;
          px[i] += (c[0] - px[i]) * a;
          px[i + 1] += (c[1] - px[i + 1]) * a;
          px[i + 2] += (c[2] - px[i + 2]) * a;
        }
      }
    }
  }

  // Canvas grain, subtle texture, vignette for dark studio shots.
  const out = Buffer.alloc(w * h * 3);
  const grain = mulberry32(seed + 99);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 3;
      const g = (grain() - 0.5) * 14;
      // Canvas weave: two crossed sine ridges plus a little noise.
      const weave = (Math.sin(x * 1.1) * Math.sin(y * 1.1)) * 5 + (noise(x * 0.5, y * 0.5, 1) - 0.5) * 8;
      const tex = weave;
      let v = 1;
      if (dark) {
        const nx = (x / w - 0.5) * 2, ny = (y / h - 0.5) * 2;
        v = 1 - Math.min(1, Math.max(0, (Math.sqrt(nx * nx + ny * ny) - 0.45) / 0.9)) * 0.75;
      }
      out[i] = Math.max(0, Math.min(255, (px[i] + g + tex) * v));
      out[i + 1] = Math.max(0, Math.min(255, (px[i + 1] + g + tex) * v));
      out[i + 2] = Math.max(0, Math.min(255, (px[i + 2] + g + tex) * v));
    }
  }
  return sharp(out, { raw: { width: w, height: h, channels: 3 } }).webp({ quality: 82 });
}

// Artworks are real images now; only studio shots are generated.
const jobs = [];
for (const s of studioShots) {
  const w = 1100, h = Math.round((w * s.h) / s.w);
  jobs.push(paint({ w, h, palette: s.palette, seed: s.seed, dark: true }).toFile(`${OUT}${s.id}.webp`));
}
await Promise.all(jobs);
console.log(`wrote ${jobs.length} files to public/art`);
