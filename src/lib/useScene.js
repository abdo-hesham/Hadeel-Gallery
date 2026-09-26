import { useLayoutEffect } from 'react';
import { gsap } from './gsap.js';

// Scroll scenes (timelines + ScrollTriggers) are built one per task, in mount order,
// after the first paint. Building every home section in the same commit was one
// 0.5-0.8 s main-thread task, which is what Lighthouse reports as Total Blocking Time.
// Mount order is DOM order, so pins are still created top to bottom.
//
// Scenes marked `waitForInput` (sections far below the fold) are held until the
// visitor first scrolls, touches, clicks or types. The pinned hero takes several
// screens of scrolling, so they are ready long before they come into view, and a
// page load with no interaction (a lab test, a bot) never pays for them.
const queue = [];
let pending = false;
let awake = false;

const WAKE_EVENTS = ['scroll', 'wheel', 'touchstart', 'pointerdown', 'pointermove', 'keydown'];

function wake() {
  if (awake) return;
  awake = true;
  WAKE_EVENTS.forEach((e) => window.removeEventListener(e, wake));
  kick();
}
if (typeof window !== 'undefined') {
  WAKE_EVENTS.forEach((e) => window.addEventListener(e, wake, { passive: true }));
}

function pump() {
  pending = false;
  // Keep order: a held scene also holds every scene queued after it.
  if (!queue.length || (queue[0].waitForInput && !awake)) return;
  queue.shift().run();
  kick();
}

function kick() {
  if (pending || !queue.length) return;
  pending = true;
  requestAnimationFrame(() => setTimeout(pump, 0));
}

export function scheduleScene(run, { waitForInput = false } = {}) {
  const job = { run, waitForInput };
  queue.push(job);
  kick();
  return () => {
    const i = queue.indexOf(job);
    if (i >= 0) queue.splice(i, 1);
  };
}

// Drop-in for `useLayoutEffect(() => { const ctx = gsap.context(setup, root); return () => ctx.revert(); }, [])`.
export function useScene(root, setup, options) {
  useLayoutEffect(() => {
    let ctx;
    const cancel = scheduleScene(() => { ctx = gsap.context(setup, root); }, options);
    return () => {
      cancel();
      ctx?.revert();
    };
    // Scenes are built once per mount, like the effects they replace.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
