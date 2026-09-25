# Hadeel — The Artist's Living Gallery

A five-page art boutique for a painter: Home, Shop, Cart, Checkout, Confirmation.
The Home page borrows the scroll-driven "flying tiles" intro from the reference
video: a lone serif title, image tiles that fly in from the edges as you scroll,
layer over the title, drift up at different speeds, then clear to a calm text block.

## Stack

- Vite + React 19, `react-router-dom`
- GSAP + ScrollTrigger for all motion, Lenis for smooth scroll
- No backend. Cart lives in `localStorage`; checkout is a demo (no payment processed)

## Run

```bash
npm install
npm run dev
```

## Artwork images

Artworks are real images in `public/art/<id>.webp`, listed in `src/data/catalog.mjs`
(titles, sizes, prices, availability). Studio/process shots are generated placeholders:

```bash
npm run art
```

## Visual QA

`scripts/shots.mjs` scrolls a page headlessly and saves frames:

```bash
node scripts/shots.mjs http://localhost:5179/ shots 0 800 1600
```

Env: `CART=blue-silence` seeds the cart, `FILL=1` fills and submits the checkout form,
`CLICK=.shop-card` clicks an element before capturing.

## Structure

```
src/
  data/catalog.mjs          artworks + studio shots
  lib/                      gsap setup, Lenis, cart context, text splitters
  components/               Nav, Cursor, PageTransition (curtain), ArtworkDetail, Footer
  pages/Home/               Hero (video-style collage), SelectedWorks, Statement,
                            Featured (scroll zoom), Studio, Available, Closing
  pages/Shop|Cart|Checkout|Confirmation.jsx
```
