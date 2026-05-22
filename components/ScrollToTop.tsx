import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { useT } from '@/lib/useTranslation';

export default function ScrollToTop() {
  const t = useT();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-3 rounded-full bg-[var(--accent-teal)] text-[var(--bg-deep)] shadow-[0_0_15px_rgba(0,191,166,0.3)] hover:shadow-[0_0_25px_rgba(0,191,166,0.6)] hover:-translate-y-1 transition-all z-50 flex items-center justify-center"
          aria-label={t.common.scroll_top}
        >
          <ChevronUp size={24} />
        </button>
      )}
    </>
  );
}
