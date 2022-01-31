/* eslint-disable react/display-name */
import mangaStyles from '@/styles/manga.module.css';
import CardListPagination from '@/components/common/CardListPagination';
import {buildFilters, getLastUpdateMangas, getTopViews} from '@/services/MangaListService';
import TopView from '@/components/manga-detail/TopView';
import BreadCrumb from '@/components/common/BreadCrumb';
import Head from 'next/head';
import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';

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
                <title>Manga List</title>
                <meta name="description" content="read manhwa online, read pornwa, manhwaonline, manga online free, free manga, manga reader, manga scans, manga raw, manga, manhwa, manhua"></meta>
                <meta name="keywords" content="Read manhwa pornwa online free at Mahwa18, update fastest, most full, synthesized 24h free with high-quality images. We hope to bring you happy moments. "></meta>
            </Head>
            <BreadCrumb links={links}></BreadCrumb>

            <div className="col-md-8">
                <CardListPagination title="List Manga" mangas={mangas} meta={meta} query={query}></CardListPagination>
            </div>
            <div className='col-md-4'>
                <TopView></TopView>
            </div>
        </div>
    )
}

export default MangaList;
