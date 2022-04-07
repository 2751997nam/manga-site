/* eslint-disable react/display-name */
import mangaStyles from '@/styles/manga.module.css';
import CardListPagination from '@/components/common/CardListPagination';
import {buildFilters, getLastUpdateMangas, getTopViews} from '@/services/MangaListService';
import BreadCrumb from '@/components/common/BreadCrumb';
import Head from 'next/head';
import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic'
import { getSiteName } from '@/lib/helper';
const TopView = dynamic(
    () => import('@/components/manga-detail/TopView'),
    { ssr: false }
);

const Tracking = dynamic(
    () => import('@/components/common/Tracking'),
    { ssr: false }
);

function MangaList(props) {
    const router = useRouter();
    const [mangas, setManagas] = useState([]);
    const [meta, setMeta] = useState({});
    const [query, setQuery] = useState({});
    const links = [{
        url: '/manga',
        text: 'Manga List'
    },
    {
        url: '/manga/bookmark',
        text: 'Bookmarked Mangas'
    }];

    const getManga = useCallback(() => {
        let mangaIds = localStorage.getItem('manhwa_bookmark');
        fetch('/api/last-update-manga?manga_ids=' + mangaIds)
            .then(res => res.json())
            .then(res => {
                setManagas(res.result);
            })
    }, [])

    useEffect(() => {
        getManga();
    }, [router.asPath, router.query, getManga]);

    return (
        <div className="row">
            <Head>
                <title>Bookmark</title>
                <meta name="description" content="Read manhwa 18+, toptoon 69, hentai, pornwa, pornhwa, webtoon, manhwa, manhua, manga online free,  manga scans, manga raw lastest chap, chapter"></meta>
                <meta name="keywords" content={`Read manhwa 18+, toptoon 69, hentai, pornwa, pornhwa, webtoon 18+ online free at ${props.siteName}, update fastest chap, chapters, most full, synthesized 24h free with high-quality images. We hope to bring you happy moments. `}></meta>
                <link rel="canonical" href={props.siteName == 'ManhwaPlus' ? 'https://manhwaplus.net/bookmark' : 'https://toptoon69.com/bookmark'} />
            </Head>
            <BreadCrumb links={links}></BreadCrumb>
            <h1 className="hidden">Bookmark</h1>
            <div className="col-md-8">
                <CardListPagination title="List Manga" mangas={mangas} meta={meta} query={query}></CardListPagination>
            </div>
            <div className='col-md-4'>
                <TopView></TopView>
            </div>
            <Tracking targetType="BOOKMARK"></Tracking>
        </div>
    )
}

export async function getServerSideProps(context) {
    const {req} = context;
    const siteName = getSiteName(req);

    return {
        props: {
            siteName: siteName,
        }
    };
}

export default MangaList;
