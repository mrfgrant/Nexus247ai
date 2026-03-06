// sitemap.ts — add this to your server/ folder
// Then in server/routes.ts (or server/index.ts), import and register:
//
//   import { sitemapRouter } from './sitemap';
//   app.use(sitemapRouter);
//
// Place it BEFORE any catch-all route like app.get('*', ...)

import { Router, Request, Response } from 'express';

const router = Router();

const BASE_URL = 'https://nexus247.ai';

// ─── ADD NEW PAGES HERE ───────────────────────────────────────────────────────
interface SitemapPage {
  path: string;
  priority: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
}

const STATIC_PAGES: SitemapPage[] = [
  {
    path: '/',
    priority: '1.0',
    changefreq: 'weekly',
  },
  {
    path: '/blog/how-to-write-a-nexus-letter-yourself',
    priority: '0.9',
    changefreq: 'monthly',
  },
  // ── Add new pages below this line ──
  // { path: '/blog/what-is-a-c-and-p-exam', priority: '0.8', changefreq: 'monthly' },
  // { path: '/blog/secondary-service-connection', priority: '0.8', changefreq: 'monthly' },
  // { path: '/blog/tdiu-benefits-explained', priority: '0.8', changefreq: 'monthly' },
  // { path: '/pricing', priority: '0.7', changefreq: 'monthly' },
];

// ─────────────────────────────────────────────────────────────────────────────

function toISODate(date: Date = new Date()): string {
  return date.toISOString().split('T')[0];
}

function buildSitemap(pages: SitemapPage[]): string {
  const today = toISODate();

  const urls = pages
    .map(
      ({ path, priority, changefreq }) => `
  <url>
    <loc>${BASE_URL}${path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
    )
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

router.get('/sitemap.xml', (_req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/xml');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.send(buildSitemap(STATIC_PAGES));
});

router.get('/robots.txt', (_req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/plain');
  res.send(`User-agent: *\nAllow: /\n\nSitemap: ${BASE_URL}/sitemap.xml`);
});

export { router as sitemapRouter };