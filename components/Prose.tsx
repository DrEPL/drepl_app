import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';

// Markdown renderer for project prose fields (context, problem, solution, results, closing_note, pipeline step descriptions).
// Uses GFM (tables, strikethrough, task lists) and a custom components map matching the site's typography.

const components: Components = {
  p: (props) => <p className="mb-3 last:mb-0 leading-relaxed" {...props} />,
  strong: (props) => <strong className="font-semibold text-[var(--text-primary)]" {...props} />,
  em: (props) => <em className="italic" {...props} />,
  code: ({ children, className, ...rest }) => {
    const isInline = !className?.startsWith('language-');
    if (isInline) {
      return (
        <code className="font-code text-[0.85em] px-1.5 py-0.5 rounded bg-[var(--bg-deep)] text-[var(--accent-teal)] border border-[var(--border)]" {...rest}>
          {children}
        </code>
      );
    }
    return (
      <code className={`${className} font-code text-sm`} {...rest}>
        {children}
      </code>
    );
  },
  pre: (props) => <pre className="my-3 p-4 rounded-xl bg-[var(--bg-deep)] border border-[var(--border)] overflow-x-auto" {...props} />,
  ul: (props) => <ul className="list-disc list-outside ml-5 space-y-1 my-2" {...props} />,
  ol: (props) => <ol className="list-decimal list-outside ml-5 space-y-1 my-2" {...props} />,
  li: (props) => <li className="leading-relaxed" {...props} />,
  a: ({ href, ...rest }) => (
    <a
      href={href}
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      className="text-[var(--accent-teal)] underline underline-offset-2 hover:opacity-80 transition-opacity"
      {...rest}
    />
  ),
  blockquote: (props) => (
    <blockquote className="my-3 pl-4 border-l-2 border-[var(--accent-teal)]/40 text-[var(--text-secondary)] italic" {...props} />
  ),
  h1: (props) => <h3 className="font-heading font-semibold text-lg mb-2 mt-4 first:mt-0" {...props} />,
  h2: (props) => <h3 className="font-heading font-semibold text-base mb-2 mt-4 first:mt-0" {...props} />,
  h3: (props) => <h4 className="font-heading font-semibold text-sm mb-2 mt-3 first:mt-0" {...props} />,
  table: (props) => (
    <div className="my-3 overflow-x-auto rounded-lg border border-[var(--border)]">
      <table className="w-full text-sm" {...props} />
    </div>
  ),
  thead: (props) => <thead className="bg-[var(--bg-deep)] text-[var(--text-muted)] text-xs uppercase tracking-wide" {...props} />,
  th: (props) => <th className="px-3 py-2 text-left font-semibold" {...props} />,
  td: (props) => <td className="px-3 py-2 border-t border-[var(--border)]" {...props} />,
  hr: () => <hr className="my-4 border-[var(--border)]" />,
};

interface ProseProps {
  children: string | null | undefined;
  className?: string;
}

export function Prose({ children, className = '' }: ProseProps) {
  if (!children) return null;
  return (
    <div className={className}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
