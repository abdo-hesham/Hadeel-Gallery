import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Inlines the built stylesheet into index.html. The site's CSS is small (~7 KB
// gzipped) and every page needs it, so a separate render-blocking request only
// delays the first paint. The .css file is still emitted for anything that links it.
function inlineCss() {
  return {
    name: 'inline-css',
    apply: 'build',
    enforce: 'post',
    generateBundle(_, bundle) {
      const html = bundle['index.html'];
      if (!html) return;
      for (const [fileName, file] of Object.entries(bundle)) {
        if (!fileName.endsWith('.css')) continue;
        const link = new RegExp(`<link rel="stylesheet"[^>]*href="/${fileName.replace(/[.]/g, '\\.')}"[^>]*>`);
        html.source = html.source.replace(link, () => `<style>${file.source}</style>`);
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), inlineCss()],
})
