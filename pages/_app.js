import Layout from '@/components/layout/master';
import Config from '@/config';
import App from 'next/app'
let categoriesCache = [];
function MyApp({ Component, pageProps, categories}) {
    return (
        <Layout categories={categories}>
            <Component {...pageProps} />
        </Layout>
    )
}

MyApp.getInitialProps = async (context) => {
    const appProps = await App.getInitialProps(context);
    const { req, query, res, asPath, pathname } = context.ctx;
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
    return {...appProps, categories: categoriesCache}
}

export default MyApp
