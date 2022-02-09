import { Fragment, useState, useEffect, useCallback } from 'react';
import Header from '@/components/layout/header';
import Head from 'next/head';
import Footer from '@/components/layout/footer';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Script from 'next/script';

function Layout(props) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const siteName = props.siteName;
    const logo = siteName == 'TopToon69' ? 'logo69' : 'logo';
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    useEffect(() => {
        const handleStart = (url) => setLoading(true);
        const handleComplete = (url) => setLoading(false);

        setTimeout(() => {
            setLoading(false);
        }, 15000);

        router.events.on('routeChangeStart', handleStart)
        router.events.on('routeChangeComplete', handleComplete)
        router.events.on('routeChangeError', handleComplete)

        return () => {
            router.events.off('routeChangeStart', handleStart)
            router.events.off('routeChangeComplete', handleComplete)
            router.events.off('routeChangeError', handleComplete)
        }
    }, [router.events, router.asPath]);

    const renderLoading = useCallback(() => {
        return loading && (
            <div className='loading-box'>
                <Image src="/images/spiner.svg" width={100} height={100} alt="loading"></Image>
            </div>
        )
    }, [loading])

    useEffect(() => {
        renderLoading();
    }, [loading, renderLoading])

    return (
        <Fragment>
            <Head>
                <meta name='viewport' content='width=device-width, initial-scale=1' />
                <meta charSet="UTF-8"></meta>
                <link rel="icon" type="image/x-icon" href={`/${logo}.ico`}></link>
                <link rel="apple-touch-icon" href={`/${logo}.ico`}></link>
                <link rel="stylesheet" href="/css/main.min.css" />
                <link rel="stylesheet" href="/css/all.min.css" />
            </Head>
            <div className="wrapper">
                <Header categories={props.categories} siteName={props.siteName} />
                <div className='content-wrapper'>
                    <div className='container mt-2rem'>
                        {props.children}
                        {renderLoading()}
                    </div>
                    <Footer categories={props.categories} siteName={props.siteName} />
                </div>
                <div className="btn-back-to-top d-block margin-navi" onClick={scrollToTop}>
                    <i className="fa fa-angle-double-up"></i>
                </div>
            </div>
        </Fragment>
    );
}

export default Layout;
