import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { gsap } from '../lib/gsap.js';
import { artworks, roomUrl, roomSrcSet, roomRatio, formatPrice } from '../data/catalog.mjs';
import ArtworkDetail from '../components/ArtworkDetail.jsx';
import Footer from '../components/Footer.jsx';

const FILTERS = ['All', 'Available', 'Sold', 'Small', 'Medium', 'Large'];
const SPAN = { large: 6, medium: 4, small: 3 };

// Asymmetric two-per-row zigzag on a 12-column grid. Left cards hug the left
// edge, right cards hug the right edge, and alternate rows step inward and drop
// down so the page reads as a hung wall rather than a product table.
function placeCard(a, i) {
  const span = SPAN[a.size];
  const row = Math.floor(i / 2);
  const right = i % 2 === 1;
  const inset = row % 2 === 1 ? 1 : 0;
  const start = right ? 13 - span - inset : 1 + inset;
  return { gridColumn: `${start} / span ${span}`, marginTop: right ? '10vh' : row % 2 ? '3vh' : 0 };
}
const SORTS = ['Newest', 'Price', 'Size'];

export default function Shop() {
  const root = useRef(null);
  const [filter, setFilter] = useState('All');
  const [sort, setSort] = useState('Newest');
  const [params, setParams] = useSearchParams();
  const openId = params.get('art');
  const open = artworks.find((a) => a.id === openId) || null;

  const list = useMemo(() => {
    let l = artworks.slice();
    if (filter === 'Available' || filter === 'Sold') l = l.filter((a) => a.status === filter.toLowerCase());
    if (filter === 'Small' || filter === 'Medium' || filter === 'Large') l = l.filter((a) => a.size === filter.toLowerCase());
    if (sort === 'Newest') l.sort((a, b) => b.year - a.year);
    if (sort === 'Price') l.sort((a, b) => a.price - b.price);
    if (sort === 'Size') l.sort((a, b) => b.width * b.height - a.width * a.height);
    return l;
  }, [filter, sort]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.shop-head .line', { yPercent: 110, stagger: 0.1, duration: 1.2, ease: 'expo.out', delay: 0.2 });
      gsap.from('.shop-head p, .shop-bar', { opacity: 0, y: 16, stagger: 0.1, delay: 0.6 });
    }, root);
    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.shop-card', { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.06, duration: 0.9, overwrite: true });
    }, root);
    return () => ctx.revert();
  }, [list]);

  const openArt = (id) => setParams(id ? { art: id } : {});

  return (
    <main ref={root} className="shop">
      <header className="shop-head">
        <span className="eyebrow">Original works</span>
        <h1 className="display">
          <span className="line-mask"><span className="line">Paintings</span></span>
          <span className="line-mask"><span className="line">created by Hadeel.</span></span>
        </h1>
        <p>Each piece exists only once.</p>
      </header>

      <div className="shop-bar">
        <div className="shop-filters">
          {FILTERS.map((f) => (
            <button key={f} className={f === filter ? 'is-active' : ''} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
        <div className="shop-sort">
          <span>Sort</span>
          {SORTS.map((s) => (
            <button key={s} className={s === sort ? 'is-active' : ''} onClick={() => setSort(s)}>{s}</button>
          ))}
        </div>
      </div>

      <div className="shop-grid">
        {list.map((a, i) => (
          <button
            key={a.id}
            className={`shop-card size-${a.size} ${a.status === 'sold' ? 'is-sold' : ''}`}
            style={placeCard(a, i)}
            onClick={() => openArt(a.id)}
            data-cursor={a.status === 'sold' ? 'Sold' : 'View'}
          >
            <figure style={{ aspectRatio: roomRatio(a) }}>
              <img src={roomUrl(a)} srcSet={roomSrcSet(a)} sizes="(max-width: 900px) 100vw, 40vw" alt={a.alt || a.title} loading="lazy" decoding="async" />
              {a.status === 'sold' && <span className="sold-tag">Sold</span>}
            </figure>
            <div className="shop-meta">
              <strong>{a.title}</strong>
              <span>{a.width} × {a.height} cm</span>
              <span className="price">{a.status === 'sold' ? '—' : formatPrice(a.price)}</span>
              <span className="link-arrow hover-only">View artwork</span>
            </div>
          </button>
        ))}
        {list.length === 0 && <p className="shop-empty">No works match this filter.</p>}
      </div>

      <Footer />
      {open && <ArtworkDetail artwork={open} onClose={() => openArt(null)} />}
    </main>
  );
}
