#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Search for .env.local: first in the worktree root, then fall back to the
// main project root (three levels up, since worktrees sit at
// <root>/.claude/worktrees/<name>/).
function findEnvLocal() {
  const candidates = [
    path.join(__dirname, '..', '.env.local'),
    path.join(__dirname, '..', '..', '..', '..', '.env.local'),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  throw new Error('.env.local not found');
}
const envPath = findEnvLocal();
const vars = {};
fs.readFileSync(envPath, 'utf8').split('\n').forEach(l => {
  const m = l.match(/^([^#=\s]+)=(.*)$/);
  if (!m) return;
  let v = m[2].trim();
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
  vars[m[1]] = v;
});

const ref = vars['NEXT_PUBLIC_SUPABASE_URL'].match(/https:\/\/([^.]+)\./)[1];
const token = vars['SUPABASE_ACCESS_TOKEN'];

async function sql(label, query) {
  process.stdout.write(`   ${label}... `);
  const res = await fetch(`https://api.supabase.com/v1/projects/${ref}/database/query`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  const data = await res.json();
  if (!res.ok) { console.log('❌'); console.error('   Erreur:', JSON.stringify(data)); throw new Error(label); }
  console.log('✅');
  return data;
}

async function main() {
  console.log('\n🌍  Migration i18n EN columns\n');
  await sql('Colonnes EN projets', `
    ALTER TABLE projects
      ADD COLUMN IF NOT EXISTS title_en TEXT,
      ADD COLUMN IF NOT EXISTS short_description_en TEXT,
      ADD COLUMN IF NOT EXISTS problem_en TEXT,
      ADD COLUMN IF NOT EXISTS solution_en TEXT,
      ADD COLUMN IF NOT EXISTS results_en TEXT
  `);
  console.log('\n✅  Migration i18n terminée !\n');
}

main().catch(err => { console.error('❌', err.message); process.exit(1); });
