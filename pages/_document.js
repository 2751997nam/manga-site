import Document, { Html, Head, Main, NextScript } from "next/document";
class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx)
        return { ...initialProps}
    }

    render() {
        return (
            <Html lang="en">
                <Head >

                <script data-cfasync="false" type="text/javascript" src="//ber2g8e3keley.com/bultykh/ipp24/7/bazinga/1891458" async></script>

                </Head>
                <body className="layout-top-nav dark-mode">
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
