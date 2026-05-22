import type { NextApiRequest, NextApiResponse } from 'next';
import * as bcrypt from 'bcryptjs';
import { supabaseAdmin } from '@/lib/supabase';
import { setSessionCookie } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { password } = req.body;
  if (!password) return res.status(400).json({ error: 'Mot de passe requis.' });

  const { data } = await supabaseAdmin
    .from('admin_settings')
    .select('password_hash')
    .single();

  if (!data) return res.status(401).json({ error: 'Aucun compte configuré.' });

  const valid = await bcrypt.compare(password, data.password_hash);
  if (!valid) return res.status(401).json({ error: 'Mot de passe incorrect.' });

  setSessionCookie(res);
  return res.status(200).json({ ok: true });
}
