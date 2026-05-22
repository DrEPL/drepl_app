import React, { ReactNode } from 'react';
import Head from 'next/head';
import Nav from './Nav';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';
import { useT } from '@/lib/useTranslation';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export default function Layout({ children, title, description }: LayoutProps) {
  const t = useT();
  const resolvedTitle = title ?? t.meta.default_title;
  const resolvedDescription = description ?? t.meta.default_description;
  return (
    <>
      <Head>
        <title>{resolvedTitle}</title>
        <meta name="description" content={resolvedDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        {/* Schema.org for Person */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Dolnick Prudhome ENZANZA",
              "jobTitle": t.meta.job_title,
              "url": "https://drepl.cg",
              "sameAs": [
                "https://www.linkedin.com/in/dolnick-prudhome-enzanza-024159246",
                "https://github.com/DrEPL"
              ]
            })
          }}
        />
      </Head>

      <div className="flex flex-col min-h-screen">
        <Nav />
        <main className="flex-grow pt-20">
          {children}
        </main>
        <Footer />
        <ScrollToTop />
      </div>
    </>
  );
}
