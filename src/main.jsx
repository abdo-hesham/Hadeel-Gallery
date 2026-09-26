import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import App from './App.jsx';
import './styles/global.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    {/* Vercel Web Analytics (visitors, pages, referrers) and Speed Insights (real-user
        Core Web Vitals). Both load their scripts after the page, from /_vercel/. */}
    <Analytics />
    <SpeedInsights />
  </StrictMode>
);
