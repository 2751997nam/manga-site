import Layout from '@/components/layout/master';
import Config from '@/config';
import App from 'next/app';
import { getSiteName, getUserAgent } from '@/lib/helper';
import '../styles/globals.css';

let categoriesCache = [];
let siteNameCache = 'ManhwaPlus';
let userAgentCache = '';
function MyApp({ Component, pageProps, categories, siteName, userAgent}) {
    return (
        <Layout categories={categories} siteName={siteName} userAgent={userAgent}>
            <Component {...pageProps} />
        </Layout>
    )
}

MyApp.getInitialProps = async (context) => {
    const appProps = await App.getInitialProps(context);
    if (context && context.ctx && context.ctx.req) {
        siteNameCache = getSiteName(context.ctx.req);
        userAgentCache = getUserAgent(context.ctx.req);
    }
    if(categoriesCache.length) {
        return {...appProps, categories: categoriesCache, siteName: siteNameCache}
    }
    let apiUrl = process.env.APP_URL;
    if (!apiUrl) {
        apiUrl = '';
    }
    const response = await fetch(`${apiUrl}/api/category?page_size=-1&fields=id,name,slug&sorts=name`)
        .then(res => res.json())
    categoriesCache = response.result;
    return {...appProps, categories: categoriesCache, siteName: siteNameCache, userAgent: userAgentCache}
}

export default MyApp
