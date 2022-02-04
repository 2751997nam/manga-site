/* eslint-disable react/display-name */
import mangaStyles from '@/styles/manga.module.css';
import {buildFilters, getLastUpdateMangas, getTopViews} from '@/services/MangaListService';
import BreadCrumb from '@/components/common/BreadCrumb';
import Head from 'next/head';
import { useState, useCallback, useEffect } from 'react';
import Card from '@/components/common/Card';
import Pagination from '@/components/common/Pagination';
import HistoryItem from '@/components/history/HistoryItem';
import { useRouter } from 'next/router';
import { getSiteName } from '@/lib/helper';
import dynamic from 'next/dynamic'

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
    const [mangas, setMangas] = useState([]);
    const [meta, setMeta] = useState({});
    const [query, setQuery] = useState({});
    const links = [{
        url: '/manga',
        text: 'Manga List'
    },
    {
        url: '/manga/history',
        text: 'History'
    }];

    const getManga = useCallback(() => {
        let historyStr = localStorage.getItem('manhwa_history');
        let history = {};
        try {
            history = JSON.parse(historyStr);
            if (!history) {
                history = {};
            }
        } catch (error) {

        }

        let chapterIds = Object.values(history);

        fetch('/api/history?chapter_ids=' + chapterIds.join(','))
            .then(res => res.json())
            .then(res => {
                setMangas(res.result);
            })
    }, [])
    
    const renderListManga = useCallback(() => {
        const deleteHistory = (mangaId) => {
            setMangas(mangas.filter(item => item.id != mangaId));
            let historyStr = localStorage.getItem('manhwa_history');
            let history = {};
            try {
                history = JSON.parse(historyStr);
                if (!history) {
                    history = {};
                }
            } catch (error) {
    
            }
            delete history[mangaId];
    
            localStorage.setItem('manhwa_history', JSON.stringify(history));
        }

        return mangas.map(item => {
            return (
                <HistoryItem manga={item} key={item.id} deleteHistory={deleteHistory}></HistoryItem>
            )
        })
    }, [mangas])

    useEffect(() => {
        getManga();
    }, [router.asPath, router.query, getManga]);

    return (
        <div className="row">
            <Head>
                <title>Reading History</title>
                <meta name="description" content="Read manhwa 18+, hentai, pornwa, webtoon, manhwa online, manga online free, free manga, manga reader, manga scans, manga raw, manga, manhwa, manhua"></meta>
                <meta name="keywords" content={`Read manhwa 18+, hentai, pornwa, webtoon 18+ online free at ${props.siteName}, update fastest chap, chapters, most full, synthesized 24h free with high-quality images. We hope to bring you happy moments. `}></meta>
            </Head>
            <BreadCrumb links={links}></BreadCrumb>
            <h1 className="hidden">Reading History</h1>
            <div className="col-md-8">
            <Card title="Reding history">
                <div className="row">
                    {renderListManga()}
                </div>
                <Pagination meta={meta} query={query}></Pagination>
            </Card>
            </div>
            <div className='col-md-4'>
                <TopView></TopView>
            </div>
            <Tracking targetType="HISTORY"></Tracking>
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
