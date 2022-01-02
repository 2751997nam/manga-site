import { Fragment, useState } from 'react';
import Header from './header';
import Head from 'next/head';
import Footer from './footer';

function Layout(props) {

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

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
