/* eslint-disable react/display-name */
import mangaStyles from '@/styles/manga.module.css';
import {buildFilters, getLastUpdateMangas, getTopViews} from '@/services/MangaListService';
import TopView from '@/components/manga-detail/TopView';
import BreadCrumb from '@/components/common/BreadCrumb';
import Head from 'next/head';
import { useState, useCallback, useEffect } from 'react';
import Card from '@/components/common/Card';
import Pagination from '@/components/common/Pagination';
import HistoryItem from '@/components/history/HistoryItem';
import { useRouter } from 'next/router';

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
                <title>Manga List</title>
                <meta name="description" content="read manhwa online, read pornwa, manhwaonline, manga online free, free manga, manga reader, manga scans, manga raw, manga, manhwa, manhua"></meta>
                <meta name="keywords" content="Read manhwa pornwa online free at Mahwa18, update fastest, most full, synthesized 24h free with high-quality images. We hope to bring you happy moments. "></meta>
            </Head>
            <BreadCrumb links={links}></BreadCrumb>

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
        </div>
    )
}

export default MangaList;
