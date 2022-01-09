import { Fragment, useState, useEffect, useCallback } from 'react';
import Header from './header';
import Head from 'next/head';
import Footer from './footer';
import { useRouter } from 'next/router';
import Image from 'next/image';

function Layout(props) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    useEffect(() => {
        const handleStart = (url) => (url !== router.asPath) && setLoading(true);
        const handleComplete = (url) => (url === router.asPath) && setLoading(false);

        router.events.on('routeChangeStart', handleStart)
        router.events.on('routeChangeComplete', handleComplete)
        router.events.on('routeChangeError', handleComplete)

        return () => {
            router.events.off('routeChangeStart', handleStart)
            router.events.off('routeChangeComplete', handleComplete)
            router.events.off('routeChangeError', handleComplete)
        }
    }, [router.events, router.asPath]);

    const renderLoading = useCallback((loading) => {
        return loading && (
            <div className='loading-box'>
                <Image src="/images/spiner.svg" width={100} height={100} alt="loading"></Image>
            </div>
        )
    }, [])

    useEffect(() => {
        renderLoading(loading);
    }, [loading, renderLoading])

    return (
        <Fragment>
            <Head>
                <meta name='viewport' content='width=device-width, initial-scale=1' />
                <meta charSet="UTF-8"></meta>
                <link rel="stylesheet" href="/css/main.css" />
                <link rel="stylesheet" href="/css/all.min.css" />
            </Head>
            <div className="wrapper">
                <Header categories={props.categories} />
                <div className='content-wrapper'>
                    <div className='container mt-2rem'>
                        {props.children}
                        {renderLoading()}
                    </div>
                    <Footer categories={props.categories} />
                </div>
                <div className="btn-back-to-top d-block margin-navi" onClick={scrollToTop}>
                    <i className="fa fa-angle-double-up"></i>
                </div>
            </div>
        </Fragment>
    );
}

export default Layout;
