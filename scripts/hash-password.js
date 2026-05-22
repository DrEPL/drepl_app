#!/usr/bin/env node
/**
 * Usage: node scripts/hash-password.js "votre_mot_de_passe"
 * Copier le résultat dans .env.local comme ADMIN_PASSWORD_HASH
 */
const bcrypt = require('bcryptjs');

const password = process.argv[2];
if (!password) {
  console.error('Usage: node scripts/hash-password.js "votre_mot_de_passe"');
  process.exit(1);
}

bcrypt.hash(password, 12).then(hash => {
  console.log('\nHash bcrypt généré :');
  console.log(hash);
  console.log('\nAjouter dans .env.local :');
  console.log(`ADMIN_PASSWORD_HASH=${hash}`);
});
