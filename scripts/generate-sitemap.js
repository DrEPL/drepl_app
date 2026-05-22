const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://drepl.cg';

const staticRoutes = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/about', priority: '0.8', changefreq: 'monthly' },
  { path: '/services', priority: '0.8', changefreq: 'monthly' },
  { path: '/portfolio', priority: '0.9', changefreq: 'weekly' },
  { path: '/contact', priority: '0.7', changefreq: 'monthly' },
];

function loadProjects() {
  try {
    const projectsFile = fs.readFileSync(path.join(__dirname, '../data/projects.ts'), 'utf-8');
    const slugMatches = [...projectsFile.matchAll(/slug:\s*'([^']+)'/g)];
    return slugMatches.map((m) => m[1]);
  } catch (err) {
    console.warn('⚠️  Impossible de lire les slugs projets :', err.message);
    return [];
  }
}

const projectSlugs = loadProjects();
const now = new Date().toISOString();

const urls = [
  ...staticRoutes.map((r) => ({ loc: `${SITE_URL}${r.path}`, priority: r.priority, changefreq: r.changefreq })),
  ...projectSlugs.map((slug) => ({ loc: `${SITE_URL}/portfolio/${slug}`, priority: '0.7', changefreq: 'monthly' })),
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

fs.writeFileSync(path.join(__dirname, '../public/sitemap.xml'), sitemap);

const robots = `User-agent: *
Allow: /
Disallow: /api/

Sitemap: ${SITE_URL}/sitemap.xml
`;
fs.writeFileSync(path.join(__dirname, '../public/robots.txt'), robots);

console.log(`✅ Sitemap (${urls.length} URLs) et robots.txt générés.`);
