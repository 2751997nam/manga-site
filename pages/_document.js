import Document, { Html, Head, Main, NextScript } from "next/document";
class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const { req } = ctx;
        let clientIpAdress = req.headers['x-real-ip'] || req.connection.remoteAddress;
        console.log('clientIpAdress', clientIpAdress);
        const initialProps = await Document.getInitialProps(ctx)
        return { ...initialProps, clientIpAdress: clientIpAdress }
    }

    render() {
        return (
            <Html lang="en">
                <Head />
                <body className="layout-top-nav dark-mode">
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
