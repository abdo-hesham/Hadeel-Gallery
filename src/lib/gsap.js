import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
gsap.defaults({ ease: 'power3.out', duration: 1 });
// Mobile browsers resize the viewport when the address bar collapses. Without this,
// every such resize refreshes ScrollTrigger mid-pin and pinned artwork jumps.
ScrollTrigger.config({ ignoreMobileResize: true });

if (import.meta.env.DEV) window.__gsap = gsap;

export { gsap, ScrollTrigger };
