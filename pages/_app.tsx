import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "@/components/Layout";
import { Analytics } from "@vercel/analytics/next";
import { DefaultSeo } from "next-seo";
import { useRouter } from "next/router";
import { useT } from "@/lib/useTranslation";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isAdminPage = router.pathname.startsWith('/admin');
  const t = useT();
  const ogLocale = router.locale === 'en' ? 'en_US' : 'fr_FR';

  return (
    <>
      <DefaultSeo
        title={t.meta.default_title}
        description={t.meta.default_description}
        openGraph={{
          type: 'website',
          locale: ogLocale,
          url: 'https://drepl.cg/',
          siteName: 'Dr EPL',
          images: [
            {
              url: 'https://drepl.cg/logo.png',
              width: 1200,
              height: 630,
              alt: 'Dolnick Prudhome ENZANZA Logo',
            },
            {
              url: 'https://drepl.cg/drepl.jpg',
              width: 800,
              height: 800,
              alt: 'Dolnick Prudhome ENZANZA',
            }
          ],
        }}
        twitter={{
          handle: '@drepl',
          site: '@drepl',
          cardType: 'summary_large_image',
        }}
      />
      {isAdminPage ? (
        <Component {...pageProps} />
      ) : (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )}
      <Analytics />
    </>
  );
}
