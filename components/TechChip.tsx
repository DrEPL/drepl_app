import { motion } from 'framer-motion';
import { getTechIcon } from '@/lib/techIcons';

interface Props {
  name: string;
  delay?: number;
}

// Tech chip with official brand logo (via simple-icons). Falls back to text-only
// when no icon is registered for the tech name.
export function TechChip({ name, delay = 0 }: Props) {
  const icon = getTechIcon(name);

  return (
    <motion.span
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      className="liquid-glass inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md bg-[var(--bg-surface)]/60 border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--text-secondary)]/50 hover:text-[var(--text-primary)] transition-colors cursor-default"
    >
      {icon ? (
        <svg
          viewBox="0 0 24 24"
          width="12"
          height="12"
          fill={`#${icon.hex}`}
          aria-hidden
          className="flex-shrink-0"
        >
          <path d={icon.path} />
        </svg>
      ) : (
        <span
          aria-hidden
          className="flex-shrink-0 w-3 h-3 rounded-sm bg-[var(--text-muted)]/30 inline-flex items-center justify-center text-[8px] font-bold text-[var(--text-muted)]"
        >
          {name.charAt(0).toUpperCase()}
        </span>
      )}
      <span>{name}</span>
    </motion.span>
  );
}
