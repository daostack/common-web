import React from 'react';
import { CssBaseline } from '@geist-ui/react';
import Document, { Head, Html, Main, NextScript } from 'next/document';

class CommonAdminDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    const styles = CssBaseline.flush();

    return {
      ...initialProps,
      styles: (
        <>
          {initialProps.styles}
          {styles}
        </>
      )
    };
  }

  render() {
    return (
      <Html>
        <Head>
          <link rel="stylesheet" href="https://unpkg.com/nprogress@0.2.0/nprogress.css"/>
        </Head>
        <body>
        <Main/>
        <NextScript/>
        </body>
      </Html>
    );
  }
}

export default CommonAdminDocument;