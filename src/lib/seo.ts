import { copy, locales, pageUrl, type Locale, type Page } from '../data/i18n';
import { memberAnchor, members, team } from '../data/team';

export const socialImage = {
  path: '/images/team.webp', width: 1600, height: 883, type: 'image/webp',
};

// Always use the configured production origin, including during local previews.
export function absoluteUrl(path: string, site: URL | undefined): string {
  if (!site) throw new Error('Set site in astro.config.mjs before generating search metadata.');
  return new URL(path, site).href;
}

export function languageAlternates(page: Page, site: URL | undefined) {
  return [
    ...locales.map(locale => ({ lang: locale, href: absoluteUrl(pageUrl(locale, page), site) })),
    { lang: 'x-default', href: absoluteUrl(pageUrl('ko', page), site) },
  ];
}

export function pageSchema(locale: Locale, page: Page, site: URL | undefined) {
  const t = copy[locale];
  const root = absoluteUrl('/', site);
  const url = absoluteUrl(pageUrl(locale, page), site);
  const organizationId = `${root}#organization`;
  const websiteId = `${root}#website`;
  const pageId = `${url}#webpage`;
  const pageType = { home: 'AboutPage', achievements: 'CollectionPage', members: 'CollectionPage', contact: 'ContactPage' }[page];
  const roster = members.map(member => ({
    '@type': 'Person',
    '@id': `${absoluteUrl(pageUrl('ko', 'members'), site)}#${memberAnchor(member.handle)}`,
    name: member.handle,
    url: `${absoluteUrl(pageUrl(locale, 'members'), site)}#${memberAnchor(member.handle)}`,
    memberOf: { '@id': organizationId },
    ...(member.bio[locale] ? { description: member.bio[locale] } : {}),
    ...(member.photo ? { image: absoluteUrl(member.photo, site) } : {}),
    ...((member.github || member.url) ? { sameAs: [member.github, member.url].filter(Boolean) } : {}),
  }));

  const graph: Record<string, unknown>[] = [
    {
      '@type': 'Organization', '@id': organizationId,
      name: team.koreanName, alternateName: team.alternateNames, url: root,
      description: t.home.lead,
      logo: { '@type': 'ImageObject', url: absoluteUrl('/apple-touch-icon.png', site), width: 180, height: 180 },
      email: team.email,
      sameAs: [team.ctftime, team.github].filter(Boolean),
      ...(page === 'members' ? { member: roster.map(person => ({ '@id': person['@id'] })) } : {}),
    },
    {
      '@type': 'WebSite', '@id': websiteId,
      url: root, name: team.siteName, alternateName: [team.koreanName, team.name],
      inLanguage: [...locales], publisher: { '@id': organizationId },
    },
    {
      '@type': pageType, '@id': pageId, url,
      name: t.meta[page], description: t.meta.description[page], inLanguage: locale,
      isPartOf: { '@id': websiteId }, about: { '@id': organizationId },
      ...(page === 'home' || page === 'contact' ? { mainEntity: { '@id': organizationId } } : {}),
      ...(page === 'members' ? { mainEntity: { '@id': `${url}#roster` } } : {}),
    },
  ];

  if (page === 'members') {
    graph.push(...roster, {
      '@type': 'ItemList', '@id': `${url}#roster`,
      name: t.members.roster, numberOfItems: roster.length,
      itemListElement: roster.map((person, index) => ({
        '@type': 'ListItem', position: index + 1, item: { '@id': person['@id'] },
      })),
    });
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}

// Prevent content containing HTML from terminating the JSON-LD script element.
export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
