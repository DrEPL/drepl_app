import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "@/components/Layout";
import { Analytics } from "@vercel/analytics/next";
import { DefaultSeo } from "next-seo";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <DefaultSeo
        title="Dr EPL | Ingénieur IA & Big Data"
        description="Dr EPL, ingenieur IA & Big Data, plateforme spécialisé en Intelligence Artificielle et Big Data. Découvrez nos solutions, services et innovations technologiques."
        openGraph={{
          type: 'website',
          locale: 'fr_FR',
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
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <Analytics />
    </>
  );
}
