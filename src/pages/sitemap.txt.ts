import type { APIRoute } from 'astro';
import { locales, pages, pageUrl } from '../data/i18n';
import { absoluteUrl } from '../lib/seo';

// A plain-text alternative for crawlers that cannot process the XML submission.
// Both formats use the same route data; hreflang remains in HTML and sitemap.xml.
export const GET: APIRoute = ({ site }) => new Response(
  locales.flatMap(locale => pages.map(page => absoluteUrl(pageUrl(locale, page), site))).join('\n') + '\n',
  { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
);
