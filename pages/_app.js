import Layout from '../components/layout/master';
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
    let appUrl = process.env.APP_URL;
    const response = await fetch(`${appUrl}/api/category?page_size=-1&fields=id,name,slug&sorts=name`)
        .then(res => res.json())
    categoriesCache = response.result;
    return {...appProps, categories: categoriesCache}
}

export default MyApp
