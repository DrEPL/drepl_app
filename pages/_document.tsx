import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="fr" data-scroll-behavior="smooth">
      <Head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#0D1117" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
