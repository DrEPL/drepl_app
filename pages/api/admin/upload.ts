import type { NextApiRequest, NextApiResponse } from 'next';
import { isAuthenticated } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export const config = { api: { bodyParser: { sizeLimit: '6mb' } } };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  if (!isAuthenticated(req)) return res.status(401).json({ error: 'Non autorisé' });

  const { filename, base64, mimeType } = req.body as {
    filename: string;
    base64: string;
    mimeType: string;
  };

  if (!filename || !base64 || !mimeType) {
    return res.status(400).json({ error: 'filename, base64 et mimeType requis.' });
  }

  const buffer = Buffer.from(base64, 'base64');
  const ext = filename.split('.').pop() ?? 'jpg';
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabaseAdmin.storage
    .from('projects')
    .upload(path, buffer, { contentType: mimeType, upsert: false });

  if (error) return res.status(500).json({ error: error.message });

  const { data } = supabaseAdmin.storage.from('projects').getPublicUrl(path);
  return res.status(200).json({ url: data.publicUrl });
}
