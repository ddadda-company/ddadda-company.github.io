import type { APIRoute } from 'astro';
import { locales, pages, pageUrl } from '../data/i18n';
import { absoluteUrl, languageAlternates } from '../lib/seo';

const xml = (value: string) => value.replace(/[<>&"']/g, char => ({
  '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;',
}[char]!));

export const GET: APIRoute = ({ site }) => {
  const entries = locales.flatMap(locale => pages.map(page => {
    const alternates = languageAlternates(page, site).map(({ lang, href }) =>
      `    <xhtml:link rel="alternate" hreflang="${lang}" href="${xml(href)}" />`,
    ).join('\n');
    return `  <url>\n    <loc>${xml(absoluteUrl(pageUrl(locale, page), site))}</loc>\n${alternates}\n  </url>`;
  }));

  // No fabricated lastmod timestamps: only canonical, indexable pages belong here.
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join('\n')}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
};
