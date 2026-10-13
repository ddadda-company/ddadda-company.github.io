import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://ddadda-company.github.io',
  output: 'static',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
});
