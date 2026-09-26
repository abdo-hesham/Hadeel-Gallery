// Shared catalog. Plain module so both the Vite app and node scripts can import it.
// Artwork images live in public/art/<id>.webp. `width`/`height` are cm and should
// match the image aspect ratio.

export const artworks = [
  { id: 'the-hat',         title: 'The Hat',          medium: 'Acrylic on canvas',        width: 90, height: 120, year: 2026, price: 0, status: 'available', size: 'large',  room: true, alt: 'Greyscale painting of a woman in a wide striped sun hat, face hidden by the brim, one arm crossed over her chest with stacked bangles' },
  { id: 'anatomy-of-us',   title: 'Anatomy of Us',    medium: 'Acrylic on canvas',        width: 62, height: 70,  year: 2026, price: 0, status: 'available', size: 'medium', room: true, alt: 'Illustrated couple embracing; the man wears a green shirt with an anatomical heart and yellow flowers, against a wall of hand-drawn hearts' },
  { id: 'veins',           title: 'Veins',            medium: 'Acrylic on canvas',        width: 80, height: 100, year: 2026, price: 0, status: 'available', size: 'large',  room: true, alt: 'Abstract botanical painting: white line-drawn leaves with fine veins over ochre, sage green and dark brown colour fields' },
  { id: 'earring',         title: 'Earring',          medium: 'Oil on canvas',            width: 56, height: 70,  year: 2025, price: 0, status: 'available', size: 'medium', room: true, alt: 'Impasto portrait from behind of a woman with dark bobbed hair and a gold hoop earring, red top, on a rose pink background' },
  { id: 'night-on-a-case', title: 'Night on a Case',  medium: 'Acrylic on phone case',    width: 8,  height: 12,  year: 2025, price: 0,  status: 'available', size: 'small', alt: 'Blue phone case hand-painted with a Starry Night style swirling sky, yellow moon and a dark cypress tree' },
  { id: 'pear-and-roses',  title: 'Pear and Roses',   medium: 'Gouache on paper',         width: 32, height: 40,  year: 2024, price: 0, status: 'sold',      size: 'small', alt: 'Gouache still life of a green pear beside a bouquet of pink roses on a dark wooden board, framed by dried petals' },
  { id: 'turban',          title: 'Turban',           medium: 'Oil on canvas',            width: 60, height: 80,  year: 2026, price: 0, status: 'available', size: 'medium', room: true, alt: 'Cubist portrait of a woman in a red and orange turban with gold hoop earrings, painted in flat geometric planes of blue, green and terracotta' },
  { id: 'half-wing',       title: 'Half Wing',        medium: 'Acrylic on canvas',        width: 40, height: 40,  year: 2025, price: 0, status: 'available', size: 'small', room: true, alt: 'Half of a butterfly painted on beige canvas: brown, white, red and blue wing cells outlined in black, with antenna and body at the right edge' },
  { id: 'cockatoo',        title: 'Cockatoo',         medium: 'Oil on canvas',            width: 50, height: 50,  year: 2025, price: 0, status: 'available', size: 'medium', room: true, alt: 'Textured painting of a white cockatoo with a yellow crest and dark eye against a black, star-speckled sky' },
  { id: 'one-milkshake',   title: 'One Milkshake',    medium: 'Coloured pencil on paper', width: 31, height: 40,  year: 2024, price: 0, status: 'sold',      size: 'small', room: true, alt: 'Coloured pencil drawing of an elderly couple sharing one pink milkshake through two straws, she in a floral blouse, he in a plaid shirt and hat' },
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

// Responsive variants from scripts/resize-art.mjs (<name>-480.webp, <name>-960.webp).
// Originals are ~1100-1250px wide; 1200w is close enough for the browser's pick.
const srcSetFor = (name) => `/art/${name}-480.webp 480w, /art/${name}-960.webp 960w, /art/${name}.webp 1200w`;
export const artSrcSet = (id) => srcSetFor(id);

// In-situ mockup (framed on a wall) for shop listings. Falls back to the flat image.
// Room mockups are all roughly 3:4; the flat image keeps the work's real ratio.
export const roomUrl = (a) => (a.room ? `/art/${a.id}-room.webp` : artUrl(a.id));
export const roomSrcSet = (a) => srcSetFor(a.room ? `${a.id}-room` : a.id);
export const roomRatio = (a) => (a.room ? '11 / 15' : `${a.width} / ${a.height}`);

// One shared formatter: constructing Intl.NumberFormat per call is slow.
const priceFormat = new Intl.NumberFormat('en-EG', {
  style: 'currency',
  currency: 'EGP',
  maximumFractionDigits: 0,
});
export const formatPrice = (value) => priceFormat.format(value);
