# BRIEF — Hadeel site scroll reel

workflow: product-launch-video
flow: solo

## Intent
Show the site as-is: a real desktop (1440x900) scroll-through of the Home page,
framed inside a browser-window mockup on a 9:16 canvas for Instagram Reels,
TikTok, Facebook Reels/feed and LinkedIn.

## Assumptions (user not available to answer)
- One 1080x1920 (9:16) master fits all four platforms (Reels, TikTok, FB
  Reels/feed, LinkedIn vertical). No separate 4:5 cut unless asked.
- No voice-over, no music (platforms add trending audio). Silent MP4.
- No real public URL known, so the end card says "Link in bio" instead of a domain.
- Length 55.5s: 51.5s captured scroll + 4s end card.

## Customizations
- Feature the site's own captured screens (video/site-scroll-1440x900.mp4) as
  the single asset. Desktop viewport must stay fully visible; never crop the page.
- Brand tokens from src/styles/global.css: ink #111110, paper #f3eee6,
  mute #7d776e, dark bg #0d0d0c, fg #f0ebe2. Cormorant Garamond + Inter Tight.
- Section captions follow the capture timeline: hero collage 0-12.5s, selected
  works 12.5-19.5, statement 19.5-23.5, featured 23.5-30, studio 30-38, available
  38-46, closing 46-51.5, end card 51.5-55.5.
- Capture forces every <img> eager and waits for decode before frame 0, so no
  lazy image is missing mid-scroll. Statement and Available scroll slower so
  their time-based reveals (1.2-1.4s) finish on screen.
- Music: user asked for Ludovico Einaudi "Nuvole Bianche". Copyrighted; not
  downloadable here. Add in-app on IG/TikTok/FB. If a licensed file is dropped
  at assets/music.mp3, mix it in (see index.html audio slot).
