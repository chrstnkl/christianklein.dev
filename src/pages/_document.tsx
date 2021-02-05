/* eslint-disable react/jsx-props-no-spreading */
import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

import Favicons from '../components/Favicons';

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App: any) => (props: any) => sheet.collectStyles(<App {...props} />),
        });
      const initialProps = await Document.getInitialProps(ctx);

      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
      <Html>
        <Head>
          <link rel="preload" href="/fonts/Domine-Bold.woff" as="font" type="font/woff" crossOrigin="anonymous" />
          <link
            rel="preload"
            href="/fonts/Montserrat-Regular.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />

          <link href="/fonts/style.css" rel="stylesheet" />
          <Favicons />
          <meta name="robots" content="follow, index" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
