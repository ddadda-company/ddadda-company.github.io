// Add the supplied photos here; keep expiring Discord URLs out of the site.
const files = import.meta.glob('../../public/images/surprises/8l4nk/*.{webp,jpg,jpeg,png,avif}', { eager: true, query: '?url', import: 'default' });
export const memberSurprisePhotos = Object.keys(files).sort().map(path => path.replace('../../public', ''));
