const fs = require('fs');
const path = require('path');

const EXTERNAL_DATA_URL = 'https://drepl.cg';

const pages = ['']; 

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages.map((page) => `
    <url>
      <loc>${EXTERNAL_DATA_URL}${page}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>1.0</priority>
    </url>
  `).join('')}
</urlset>
`;

fs.writeFileSync(path.join(__dirname, '../public/sitemap.xml'), sitemap);

console.log('✅ Sitemap généré dans public/sitemap.xml');
