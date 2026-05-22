import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { Save, X, Plus, Upload, Trash2, ImageIcon } from 'lucide-react';
import type { ProjectRow } from '@/lib/supabase';

type ProjectFormData = Omit<ProjectRow, 'id' | 'created_at' | 'updated_at'>;

interface Props {
  initialData?: Partial<ProjectRow>;
  onSubmit: (data: ProjectFormData) => Promise<void>;
  isLoading: boolean;
}

const emptyForm: ProjectFormData = {
  slug: '', title: '', short_description: '', problem: '', solution: '', results: '',
  category: 'IA', technologies: [], categorized_technologies: [],
  image_url: '/file.svg', logo_url: null, github_url: null, demo_url: null,
  developed_at: null, screenshots: [], is_private_repo: false, display_order: 0,
  title_en: null, short_description_en: null, problem_en: null, solution_en: null, results_en: null,
};

// ── Upload helper ─────────────────────────────────────────────
async function uploadFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(',')[1];
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name, base64, mimeType: file.type }),
      });
      if (!res.ok) { const d = await res.json(); reject(new Error(d.error)); return; }
      const { url } = await res.json();
      resolve(url);
    };
    reader.onerror = () => reject(new Error('Erreur de lecture du fichier'));
    reader.readAsDataURL(file);
  });
}

// ── ImageUpload component ─────────────────────────────────────
function ImageUpload({
  value, onChange, label, accept = 'image/*'
}: { value: string | null; onChange: (url: string) => void; label: string; accept?: string }) {
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setUploading(true);
    try {
      const url = await uploadFile(file);
      onChange(url);
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Erreur upload');
    } finally {
      setUploading(false);
    }
  };

  const hasImage = value && value !== '/file.svg' && !value.startsWith('/');

  return (
    <div>
      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">{label}</label>
      <div
        className={`relative border-2 border-dashed rounded-xl transition-colors cursor-pointer ${
          dragging ? 'border-[var(--accent-teal)] bg-[var(--accent-teal)]/5' : 'border-[var(--border)] hover:border-[var(--accent-teal)]/50'
        }`}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
        onClick={() => inputRef.current?.click()}
      >
        {hasImage ? (
          <div className="relative h-40 w-full rounded-xl overflow-hidden">
            <Image src={value!} alt="preview" fill className="object-cover" sizes="400px" />
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <span className="text-white text-sm font-medium flex items-center gap-1"><Upload size={14} /> Remplacer</span>
            </div>
          </div>
        ) : (
          <div className="h-32 flex flex-col items-center justify-center gap-2 text-[var(--text-muted)]">
            {uploading
              ? <div className="w-6 h-6 border-2 border-[var(--accent-teal)]/30 border-t-[var(--accent-teal)] rounded-full animate-spin" />
              : <><ImageIcon size={28} className="opacity-50" /><span className="text-xs">Cliquer ou glisser une image</span></>
            }
          </div>
        )}
        <input ref={inputRef} type="file" accept={accept} className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
      </div>
    </div>
  );
}

// ── Main form ─────────────────────────────────────────────────
export default function ProjectForm({ initialData, onSubmit, isLoading }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<ProjectFormData>({ ...emptyForm, ...initialData });
  const [techInput, setTechInput] = useState('');
  const [error, setError] = useState('');
  const [screenshotForm, setScreenshotForm] = useState({ title: '', description: '' });
  const [uploadingScreenshot, setUploadingScreenshot] = useState(false);
  const screenshotRef = useRef<HTMLInputElement>(null);

  const set = (field: keyof ProjectFormData, value: unknown) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const addTech = () => {
    const tech = techInput.trim();
    if (tech && !form.technologies.includes(tech)) set('technologies', [...form.technologies, tech]);
    setTechInput('');
  };

  const addScreenshot = async (file: File) => {
    if (!screenshotForm.title.trim()) { alert('Donnez un titre à la capture avant d\'uploader.'); return; }
    setUploadingScreenshot(true);
    try {
      const url = await uploadFile(file);
      set('screenshots', [...form.screenshots, { url, title: screenshotForm.title, description: screenshotForm.description }]);
      setScreenshotForm({ title: '', description: '' });
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Erreur upload');
    } finally {
      setUploadingScreenshot(false);
    }
  };

  const removeScreenshot = (idx: number) =>
    set('screenshots', form.screenshots.filter((_, i) => i !== idx));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.slug || !form.title || !form.category) {
      setError('Slug, titre et catégorie sont obligatoires.');
      return;
    }
    try { await onSubmit(form); }
    catch (err: unknown) { setError(err instanceof Error ? err.message : 'Une erreur est survenue.'); }
  };

  const inputClass = "w-full bg-[var(--bg-deep)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-teal)] transition-colors text-sm";
  const labelClass = "block text-sm font-medium text-[var(--text-secondary)] mb-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && <div className="text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-sm">{error}</div>}

      {/* Informations de base */}
      <section className="glass-dark border border-[var(--border)] rounded-2xl p-6 space-y-5">
        <h2 className="font-heading font-semibold text-[var(--text-primary)] text-lg">Informations de base</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Titre *</label>
            <input type="text" className={inputClass} value={form.title} required
              onChange={e => {
                set('title', e.target.value);
                if (!initialData?.slug)
                  set('slug', e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
              }} />
          </div>
          <div>
            <label className={labelClass}>Slug (URL) *</label>
            <input type="text" className={inputClass} value={form.slug}
              onChange={e => set('slug', e.target.value)} required />
          </div>
        </div>
        <div>
          <label className={labelClass}>Description courte</label>
          <textarea className={`${inputClass} resize-none`} rows={2} value={form.short_description || ''}
            onChange={e => set('short_description', e.target.value)} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className={labelClass}>Catégorie *</label>
            <select className={inputClass} value={form.category}
              onChange={e => set('category', e.target.value as ProjectRow['category'])}>
              {['IA', 'Big Data', 'Web/Mobile', 'IoT'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Développé chez</label>
            <input type="text" className={inputClass} value={form.developed_at || ''}
              onChange={e => set('developed_at', e.target.value || null)} placeholder="Ex: DiCentre4AI" />
          </div>
          <div>
            <label className={labelClass}>Ordre d&apos;affichage</label>
            <input type="number" className={inputClass} value={form.display_order}
              onChange={e => set('display_order', parseInt(e.target.value))} />
          </div>
        </div>
      </section>

      {/* Contenu détaillé */}
      <section className="glass-dark border border-[var(--border)] rounded-2xl p-6 space-y-5">
        <h2 className="font-heading font-semibold text-[var(--text-primary)] text-lg">Contenu détaillé</h2>
        {[
          { label: 'La Problématique', field: 'problem' },
          { label: 'La Solution', field: 'solution' },
          { label: 'Résultats & Impact', field: 'results' },
        ].map(({ label, field }) => (
          <div key={field}>
            <label className={labelClass}>{label}</label>
            <textarea className={`${inputClass} resize-none`} rows={4}
              value={(form[field as keyof ProjectFormData] as string) || ''}
              onChange={e => set(field as keyof ProjectFormData, e.target.value)} />
          </div>
        ))}
      </section>

      {/* Technologies */}
      <section className="glass-dark border border-[var(--border)] rounded-2xl p-6 space-y-5">
        <h2 className="font-heading font-semibold text-[var(--text-primary)] text-lg">Technologies</h2>
        <div className="flex gap-3">
          <input type="text" className={inputClass} value={techInput}
            onChange={e => setTechInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTech(); } }}
            placeholder="Ex: Python, React, Docker..." />
          <button type="button" onClick={addTech}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[var(--accent-teal)]/10 border border-[var(--accent-teal)]/20 text-[var(--accent-teal)] hover:bg-[var(--accent-teal)]/20 transition-colors text-sm font-medium whitespace-nowrap">
            <Plus size={16} /> Ajouter
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {form.technologies.map(tech => (
            <span key={tech} className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)] px-3 py-1 border border-[var(--border)] rounded-lg bg-[var(--bg-deep)]">
              {tech}
              <button type="button" onClick={() => set('technologies', form.technologies.filter(t => t !== tech))}
                className="text-[var(--text-muted)] hover:text-red-400 transition-colors">
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      </section>

      {/* Images */}
      <section className="glass-dark border border-[var(--border)] rounded-2xl p-6 space-y-6">
        <h2 className="font-heading font-semibold text-[var(--text-primary)] text-lg">Images</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ImageUpload label="Image principale" value={form.image_url}
            onChange={url => set('image_url', url)} />
          <ImageUpload label="Logo du projet" value={form.logo_url}
            onChange={url => set('logo_url', url)} />
        </div>

        {/* Screenshots */}
        <div>
          <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-3">Captures d&apos;écran</h3>

          {/* Formulaire ajout screenshot */}
          <div className="bg-[var(--bg-deep)] border border-[var(--border)] rounded-xl p-4 space-y-3 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-[var(--text-muted)] mb-1">Titre *</label>
                <input type="text" className={inputClass} value={screenshotForm.title}
                  onChange={e => setScreenshotForm(p => ({ ...p, title: e.target.value }))}
                  placeholder="Ex: Page d'accueil" />
              </div>
              <div>
                <label className="block text-xs text-[var(--text-muted)] mb-1">Description</label>
                <input type="text" className={inputClass} value={screenshotForm.description}
                  onChange={e => setScreenshotForm(p => ({ ...p, description: e.target.value }))}
                  placeholder="Courte description..." />
              </div>
            </div>
            <button type="button"
              onClick={() => screenshotRef.current?.click()}
              disabled={uploadingScreenshot}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--accent-teal)]/10 border border-[var(--accent-teal)]/20 text-[var(--accent-teal)] hover:bg-[var(--accent-teal)]/20 transition-colors text-sm font-medium disabled:opacity-50">
              {uploadingScreenshot
                ? <div className="w-4 h-4 border-2 border-[var(--accent-teal)]/30 border-t-[var(--accent-teal)] rounded-full animate-spin" />
                : <Upload size={16} />}
              Uploader une capture
            </button>
            <input ref={screenshotRef} type="file" accept="image/*" className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) addScreenshot(f); e.target.value = ''; }} />
          </div>

          {/* Liste screenshots */}
          {form.screenshots.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {form.screenshots.map((s, idx) => (
                <div key={idx} className="relative group rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--bg-deep)]">
                  <div className="relative aspect-video">
                    <Image src={s.url} alt={s.title} fill className="object-cover" sizes="200px" />
                  </div>
                  <div className="p-2">
                    <p className="text-xs font-medium text-[var(--text-primary)] truncate">{s.title}</p>
                    {s.description && <p className="text-xs text-[var(--text-muted)] truncate">{s.description}</p>}
                  </div>
                  <button type="button" onClick={() => removeScreenshot(idx)}
                    className="absolute top-2 right-2 p-1 rounded-lg bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Liens */}
      <section className="glass-dark border border-[var(--border)] rounded-2xl p-6 space-y-5">
        <h2 className="font-heading font-semibold text-[var(--text-primary)] text-lg">Liens</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>GitHub URL</label>
            <input type="url" className={inputClass} value={form.github_url || ''}
              onChange={e => set('github_url', e.target.value || null)} />
          </div>
          <div>
            <label className={labelClass}>Demo URL</label>
            <input type="url" className={inputClass} value={form.demo_url || ''}
              onChange={e => set('demo_url', e.target.value || null)} />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <input type="checkbox" id="isPrivateRepo" checked={form.is_private_repo}
            onChange={e => set('is_private_repo', e.target.checked)}
            className="w-4 h-4 accent-[var(--accent-teal)]" />
          <label htmlFor="isPrivateRepo" className="text-sm text-[var(--text-secondary)]">Repository privé</label>
        </div>
      </section>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4">
        <button type="button" onClick={() => router.back()}
          className="flex items-center gap-2 px-6 py-3 rounded-xl border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-sm font-medium">
          <X size={18} /> Annuler
        </button>
        <button type="submit" disabled={isLoading}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--accent-teal)] text-[var(--bg-deep)] font-bold hover:opacity-90 transition-opacity text-sm disabled:opacity-50">
          {isLoading
            ? <div className="w-4 h-4 border-2 border-[var(--bg-deep)]/30 border-t-[var(--bg-deep)] rounded-full animate-spin" />
            : <><Save size={18} /> Enregistrer</>}
        </button>
      </div>
    </form>
  );
}
