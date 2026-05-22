import { useRouter } from 'next/router';
import fr from '@/locales/fr';
import en from '@/locales/en';

const dicts = { fr, en };

export function useT() {
  const { locale } = useRouter();
  return dicts[(locale ?? 'fr') as 'fr' | 'en'] ?? dicts.fr;
}
