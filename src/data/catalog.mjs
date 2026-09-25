// Shared catalog. Plain module so both the Vite app and node scripts can import it.
// Artwork images live in public/art/<id>.webp. `width`/`height` are cm and should
// match the image aspect ratio.

export const artworks = [
  { id: 'the-hat',         title: 'The Hat',          medium: 'Acrylic on canvas',        width: 90, height: 120, year: 2026, price: 48900, status: 'available', size: 'large',  room: true },
  { id: 'anatomy-of-us',   title: 'Anatomy of Us',    medium: 'Acrylic on canvas',        width: 62, height: 70,  year: 2026, price: 27000, status: 'available', size: 'medium', room: true },
  { id: 'veins',           title: 'Veins',            medium: 'Acrylic on canvas',        width: 80, height: 100, year: 2026, price: 40600, status: 'available', size: 'large',  room: true },
  { id: 'earring',         title: 'Earring',          medium: 'Oil on canvas',            width: 56, height: 70,  year: 2025, price: 23900, status: 'available', size: 'medium', room: true },
  { id: 'night-on-a-case', title: 'Night on a Case',  medium: 'Acrylic on phone case',    width: 8,  height: 12,  year: 2025, price: 4700,  status: 'available', size: 'small' },
  { id: 'pear-and-roses',  title: 'Pear and Roses',   medium: 'Gouache on paper',         width: 32, height: 40,  year: 2024, price: 13500, status: 'sold',      size: 'small' },
  { id: 'turban',          title: 'Turban',           medium: 'Oil on canvas',            width: 60, height: 80,  year: 2026, price: 35400, status: 'available', size: 'medium', room: true },
  { id: 'half-wing',       title: 'Half Wing',        medium: 'Acrylic on canvas',        width: 40, height: 40,  year: 2025, price: 17700, status: 'available', size: 'small', room: true },
  { id: 'cockatoo',        title: 'Cockatoo',         medium: 'Oil on canvas',            width: 50, height: 50,  year: 2025, price: 21800, status: 'available', size: 'medium', room: true },
  { id: 'one-milkshake',   title: 'One Milkshake',    medium: 'Coloured pencil on paper', width: 31, height: 40,  year: 2024, price: 11400, status: 'sold',      size: 'small', room: true },
];

// Studio shots are generated placeholders (see scripts/gen-art.mjs).
export const studioShots = [
  { id: 'studio-hands', label: 'Hands', w: 900, h: 1100, seed: 201, palette: ['#1a1613', '#332a24', '#c9a98a', '#8a5a3c', '#e6cdb4'] },
  { id: 'studio-palette', label: 'Palette', w: 1100, h: 800, seed: 211, palette: ['#14120f', '#2b2521', '#c8262d', '#2f7f8c', '#e0a35a', '#8fb3d9'] },
  { id: 'studio-canvas', label: 'Canvas close-up', w: 900, h: 900, seed: 223, palette: ['#1c1a17', '#3c3630', '#d9d4b8', '#5f7a5a', '#b8452b'] },
  { id: 'studio-room', label: 'Studio', w: 1200, h: 800, seed: 229, palette: ['#100f0e', '#2a2623', '#8a7a68', '#cfc2ad', '#3f3833'] },
  { id: 'studio-artist', label: 'Artist', w: 800, h: 1000, seed: 239, palette: ['#161311', '#2e2622', '#b58a6e', '#e2c5aa', '#5a3f31'] },
];

export const artUrl = (id) => `/art/${id}.webp`;

// In-situ mockup (framed on a wall) for shop listings. Falls back to the flat image.
// Room mockups are all roughly 3:4; the flat image keeps the work's real ratio.
export const roomUrl = (a) => (a.room ? `/art/${a.id}-room.webp` : artUrl(a.id));
export const roomRatio = (a) => (a.room ? '11 / 15' : `${a.width} / ${a.height}`);

export const formatPrice = (value) => new Intl.NumberFormat('en-EG', {
  style: 'currency',
  currency: 'EGP',
  maximumFractionDigits: 0,
}).format(value);
