// Generates responsive variants of the artwork images so pages never ship the
// full-size originals into small slots. Writes public/art/<name>-<width>.webp
// for every width in WIDTHS (skipped when the source is narrower).
// Usage: node scripts/resize-art.mjs
import sharp from 'sharp';
import { existsSync } from 'node:fs';
import { artworks } from '../src/data/catalog.mjs';

export const WIDTHS = [480, 960];
const DIR = 'public/art';

const names = [
  ...artworks.map((a) => a.id),
  ...artworks.filter((a) => a.room).map((a) => `${a.id}-room`),
];

// The artist portrait only exists as a PNG; convert it to a full-size webp first.
if (!existsSync(`${DIR}/the-artist.webp`)) {
  await sharp(`${DIR}/the-artist.png`).resize({ width: 1200, withoutEnlargement: true }).webp({ quality: 78 }).toFile(`${DIR}/the-artist.webp`);
}
names.push('the-artist');

for (const name of names) {
  const src = `${DIR}/${name}.webp`;
  const { width } = await sharp(src).metadata();
  for (const w of WIDTHS) {
    if (w >= width) continue;
    await sharp(src).resize({ width: w }).webp({ quality: 74, effort: 6 }).toFile(`${DIR}/${name}-${w}.webp`);
  }
  console.log(name);
}
