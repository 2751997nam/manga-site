/* eslint-disable react/display-name */
import mangaStyles from '@/styles/manga.module.css';
import CustomLink from '@/components/common/CustomLink';
import Image from 'next/image';
import CardListPagination from '@/components/common/CardListPagination';
import {buildFilters, getLastUpdateMangas, getTopViews} from '@/services/MangaListService';
import DB from '@/lib/db';
import SortBox from '@/components/common/SortBox';
import BreadCrumb from '@/components/common/BreadCrumb';
import SearchAdvance from '@/components/Search/SearchAdvance';
import Head from 'next/head';
import { useState } from 'react';
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
    const [isAdvance, setIsAdvance] = useState(false);
    const mangas = props.mangas;
    const topViews = props.topViews;
    const topViewsMonth = props.topViewsMonth;
    const topViewsAll = props.topViewsAll;
    const meta = props.meta;
    const query = props.query;
    const links = props.breadcrumbs;

    const toogleSearchAdvance = () => {
        setIsAdvance(!isAdvance);
    }

    return (
        <div className="row">
            <Head>
                <title>{props.title}</title>
                <meta name="description" content="Read manhwa 18+, toptoon 69, hentai, pornwa, pornhwa, webtoon, manhwa, manhua, manga online free,  manga scans, manga raw"></meta>
                <meta name="keywords" content={props.keywords}></meta>
            </Head>
            <BreadCrumb links={links}></BreadCrumb>
            <h1 className="hidden">{props.title}</h1>
            <SortBox toogleSearchAdvance={toogleSearchAdvance}></SortBox>
            <div className="col-md-8">
                {isAdvance && <SearchAdvance categories={props.categories}></SearchAdvance>}
            </div>
            <div className="col-md-8">
                <CardListPagination title="Manga List" mangas={mangas} meta={meta} query={query}></CardListPagination>
            </div>
            <div className='col-md-4'>
                <TopView></TopView>
            </div>
            <Tracking targetType="MANGA_LIST" targetId={props.genreId}></Tracking>
        </div>
    )
}

const buildParams = (params) => {
    let result = {};
    for (let key in params) {
        if (key != 'slug') {
            result[key] = params[key];
        }
    }

    return result;
}

export async function getServerSideProps(context) {
    const db = DB();
    const filter = await buildFilters(db, context.query);
    const {req} = context;
    const siteName = getSiteName(req);
    let title = 'Manga List';
    let keywords = `Read manhwa 18+, toptoon 69, hentai, pornwa, pornhwa, webtoon 18+ online free at ${siteName}, update fastest chap, chapters, most full, synthesized 24h free with high-quality images. We hope to bring you happy moments. `;
    let props = {
        breadcrumbs: [{
            url: '/manga',
            text: 'Manga List'
        }]
    };
    if (filter.genreId) {
        const category = await db.from('category').where('id', filter.genreId).first(['id', 'name', 'slug']);
        if (category) {
            props.genreId = filter.genreId;
            title = 'Genre ' + category.name;
            keywords = `Read manhwa ${category.name}, hentai, pornwa, pornhwa, webtoon 18+ online free at ${siteName}, update fastest chap, chapters, most full, synthesized 24h free with high-quality images. We hope to bring you happy moments. `
            props.breadcrumbs.push({
                url: '/manga-genre-' + category.slug,
                text: category.name
            })
        }
    }
    const {mangas, meta} = await getLastUpdateMangas(db, filter);

    props.title = title;
    props.keywords = keywords;
    props.mangas = JSON.parse(JSON.stringify(mangas));
    props.meta = meta;
    props.query = buildParams(context.query);

    return {
        props: props
    };
}

export default MangaList;
