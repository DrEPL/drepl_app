import { Plus, Trash2 } from 'lucide-react';
import type {
  Translatable,
  KpiStat,
  TeamMember,
  PipelineStep,
} from '@/lib/supabase';

const inputClass =
  'w-full bg-[var(--bg-deep)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-teal)] transition-colors';
const labelClass = 'block text-xs font-medium text-[var(--text-muted)] mb-1';

function emptyT(): Translatable<string> {
  return { fr: '', en: '' };
}

// Shared paired FR/EN input for a Translatable scalar leaf.
function TranslatableInput({
  label,
  value,
  onChange,
  rows = 1,
  placeholderFr,
  placeholderEn,
}: {
  label: string;
  value: Translatable<string>;
  onChange: (next: Translatable<string>) => void;
  rows?: number;
  placeholderFr?: string;
  placeholderEn?: string;
}) {
  const isTextarea = rows > 1;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div>
        <label className={labelClass}>{label} (FR)</label>
        {isTextarea ? (
          <textarea
            className={`${inputClass} resize-none`}
            rows={rows}
            value={value.fr ?? ''}
            placeholder={placeholderFr}
            onChange={(e) => onChange({ ...value, fr: e.target.value })}
          />
        ) : (
          <input
            type="text"
            className={inputClass}
            value={value.fr ?? ''}
            placeholder={placeholderFr}
            onChange={(e) => onChange({ ...value, fr: e.target.value })}
          />
        )}
      </div>
      <div>
        <label className={labelClass}>{label} (EN — auto-traduit)</label>
        {isTextarea ? (
          <textarea
            className={`${inputClass} resize-none opacity-80`}
            rows={rows}
            value={value.en ?? ''}
            placeholder={placeholderEn}
            onChange={(e) => onChange({ ...value, en: e.target.value })}
          />
        ) : (
          <input
            type="text"
            className={`${inputClass} opacity-80`}
            value={value.en ?? ''}
            placeholder={placeholderEn}
            onChange={(e) => onChange({ ...value, en: e.target.value })}
          />
        )}
      </div>
    </div>
  );
}

// Generic list section: handles ordering, add button, remove button.
function ListSection<T>({
  title,
  hint,
  items,
  onChange,
  newItem,
  renderItem,
}: {
  title: string;
  hint?: string;
  items: T[];
  onChange: (next: T[]) => void;
  newItem: () => T;
  renderItem: (item: T, idx: number, update: (patch: Partial<T>) => void) => React.ReactNode;
}) {
  const add = () => onChange([...items, newItem()]);
  const remove = (idx: number) => onChange(items.filter((_, i) => i !== idx));
  const update = (idx: number, patch: Partial<T>) =>
    onChange(items.map((it, i) => (i === idx ? { ...(it as object), ...patch } as T : it)));

  return (
    <section className="glass-dark border border-[var(--border)] rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading font-semibold text-[var(--text-primary)] text-lg">{title}</h2>
          {hint && <p className="text-xs text-[var(--text-muted)] mt-1">{hint}</p>}
        </div>
        <button
          type="button"
          onClick={add}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--accent-teal)]/10 border border-[var(--accent-teal)]/20 text-[var(--accent-teal)] hover:bg-[var(--accent-teal)]/20 transition-colors text-xs font-medium"
        >
          <Plus size={14} /> Ajouter
        </button>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)] italic">Aucune entrée.</p>
      ) : (
        <div className="space-y-4">
          {items.map((item, idx) => (
            <div key={idx} className="bg-[var(--bg-deep)] border border-[var(--border)] rounded-xl p-4 space-y-3 relative">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">#{idx + 1}</span>
                <button
                  type="button"
                  onClick={() => remove(idx)}
                  className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  aria-label="Supprimer"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              {renderItem(item, idx, (patch) => update(idx, patch))}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// ── KpiStats ────────────────────────────────────────────────
export function KpiStatsEditor({ value, onChange }: { value: KpiStat[]; onChange: (next: KpiStat[]) => void }) {
  return (
    <ListSection<KpiStat>
      title="Chiffres clés"
      hint="Statistiques d'impact affichées en bannière sous le hero."
      items={value}
      onChange={onChange}
      newItem={() => ({ value: '', label: emptyT(), icon: '' })}
      renderItem={(item, _idx, update) => (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Valeur</label>
              <input
                type="text"
                className={inputClass}
                value={item.value}
                placeholder="Ex: 1/3, 85%, 60%"
                onChange={(e) => update({ value: e.target.value })}
              />
            </div>
            <div>
              <label className={labelClass}>Icône (Lucide, optionnel)</label>
              <input
                type="text"
                className={inputClass}
                value={item.icon ?? ''}
                placeholder="Ex: alert-triangle"
                onChange={(e) => update({ icon: e.target.value })}
              />
            </div>
          </div>
          <TranslatableInput
            label="Libellé"
            value={item.label}
            onChange={(l) => update({ label: l })}
            placeholderFr="Ex: femmes victimes de violences"
          />
        </>
      )}
    />
  );
}

// ── TeamMembers ─────────────────────────────────────────────
export function TeamMembersEditor({ value, onChange }: { value: TeamMember[]; onChange: (next: TeamMember[]) => void }) {
  return (
    <ListSection<TeamMember>
      title="Équipe"
      hint="Laisser vide si projet solo — la section ne s'affichera pas."
      items={value}
      onChange={onChange}
      newItem={() => ({ name: '', role: emptyT(), avatar_url: '', is_lead: false })}
      renderItem={(item, _idx, update) => (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Nom</label>
              <input
                type="text"
                className={inputClass}
                value={item.name}
                onChange={(e) => update({ name: e.target.value })}
              />
            </div>
            <div>
              <label className={labelClass}>Avatar URL (optionnel)</label>
              <input
                type="text"
                className={inputClass}
                value={item.avatar_url ?? ''}
                onChange={(e) => update({ avatar_url: e.target.value })}
              />
            </div>
          </div>
          <TranslatableInput label="Rôle" value={item.role} onChange={(r) => update({ role: r })} />
          <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            <input
              type="checkbox"
              checked={item.is_lead ?? false}
              onChange={(e) => update({ is_lead: e.target.checked })}
              className="w-4 h-4 accent-[var(--accent-teal)]"
            />
            Lead du projet
          </label>
        </>
      )}
    />
  );
}

// ── PipelineSteps ───────────────────────────────────────────
export function PipelineStepsEditor({ value, onChange }: { value: PipelineStep[]; onChange: (next: PipelineStep[]) => void }) {
  return (
    <ListSection<PipelineStep>
      title="Étapes du pipeline"
      hint="Étapes numérotées d'un workflow ETL ou de traitement."
      items={value}
      onChange={onChange}
      newItem={() => ({ order: value.length + 1, title: emptyT(), description: emptyT() })}
      renderItem={(item, _idx, update) => (
        <>
          <div>
            <label className={labelClass}>Ordre</label>
            <input
              type="number"
              className={inputClass}
              value={item.order}
              onChange={(e) => update({ order: parseInt(e.target.value) || 0 })}
            />
          </div>
          <TranslatableInput label="Titre" value={item.title} onChange={(t) => update({ title: t })} />
          <TranslatableInput
            label="Description"
            value={item.description}
            onChange={(d) => update({ description: d })}
            rows={3}
          />
        </>
      )}
    />
  );
}

