import type { NextApiRequest, NextApiResponse } from 'next';
import * as bcrypt from 'bcryptjs';
import { supabaseAdmin } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { data: existing } = await supabaseAdmin
    .from('admin_settings')
    .select('id')
    .single();

  if (existing) {
    return res.status(400).json({ error: 'Mot de passe déjà configuré.' });
  }

  const { password } = req.body;
  if (!password || password.length < 8) {
    return res.status(400).json({ error: 'Minimum 8 caractères.' });
  }

  const hash = await bcrypt.hash(password, 12);
  const { error } = await supabaseAdmin
    .from('admin_settings')
    .insert([{ id: 1, password_hash: hash }]);

  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ ok: true });
}
