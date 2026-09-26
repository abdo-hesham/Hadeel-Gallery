import { track as vercelTrack } from '@vercel/analytics/react';

// Custom events for Vercel Web Analytics (dashboard: Project > Analytics > Events).
// Only artwork and money facts are sent; never names, emails or addresses.
// Custom events need a Vercel Pro plan; on Hobby they are dropped and page views still work.
export function track(name, props) {
  try {
    vercelTrack(name, props);
  } catch {
    /* analytics must never break the shop */
  }
}
