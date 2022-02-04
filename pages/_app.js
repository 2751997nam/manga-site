import Layout from '@/components/layout/master';
import Config from '@/config';
import App from 'next/app';
import { getSiteName } from '@/lib/helper';
let categoriesCache = [];
let siteNameCache = 'ManhwaPlus';
function MyApp({ Component, pageProps, categories, siteName}) {
    return (
        <Layout categories={categories} siteName={siteName}>
            <Component {...pageProps} />
        </Layout>
    )
}

MyApp.getInitialProps = async (context) => {
    const appProps = await App.getInitialProps(context);
    if (context && context.ctx && context.ctx.req) {
        siteNameCache = getSiteName(context.ctx.req);
    }
    if(categoriesCache.length) {
        return {...appProps, categories: categoriesCache}
    }
    let apiUrl = process.env.APP_URL;
    if (!apiUrl) {
        apiUrl = '';
    }
    const response = await fetch(`${apiUrl}/api/category?page_size=-1&fields=id,name,slug&sorts=name`)
        .then(res => res.json())
    categoriesCache = response.result;
    return {...appProps, categories: categoriesCache, siteName: siteNameCache}
}

export default MyApp
