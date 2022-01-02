/* eslint-disable react/display-name */
import mangaStyles from '../../styles/manga.module.css';
import CustomLink from '../../components/common/CustomLink';
import Image from 'next/image';
import CardListPagination from '../../components/common/CardListPagination';
import {buildFilters, getLastUpdateMangas} from '../../services/MangaListService';
import DB from '../../lib/db';
import TopView from '../../components/manga-detail/TopView';
import SortBox from '../../components/common/SortBox';
import BreadCrumb from '../../components/common/BreadCrumb';
import Head from 'next/head';

function MangaList(props) {
    const mangas = props.mangas;
    const topViews = props.topViews;
    const topViewsMonth = props.topViewsMonth;
    const topViewsAll = props.topViewsAll;
    const meta = props.meta;
    const query = props.query;
    const links = [{
        url: '/manga',
        text: 'Manga List'
    }];

    return (
        <div className="row">
            <Head>
                <title>Manga List</title>
                <meta name="description" content="read manhwa online, read pornwa, manhwaonline, manga online free, free manga, manga reader, manga scans, manga raw, manga, manhwa, manhua"></meta>
                <meta name="keywords" content="Read manhwa pornwa online free at Mahwa18, update fastest, most full, synthesized 24h free with high-quality images. We hope to bring you happy moments. "></meta>
            </Head>
            <BreadCrumb links={links}></BreadCrumb>
            <SortBox></SortBox>
            <div className="col-md-8">
                <CardListPagination title="List Manga" mangas={mangas} meta={meta} query={query}></CardListPagination>
            </div>
            <div className='col-md-4'>
                <TopView topViewsDay={topViews} topViewsMonth={topViewsMonth} topViewsAll={topViewsAll}></TopView>
            </div>
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
    const {mangas, meta} = await getLastUpdateMangas(db, filter);

    const topViews = await getLastUpdateMangas(db, {mangaOrderBy: {field: 'view_day', sort: 'desc'}, pageSize: 5, getOnlyResult: true});
    const topViewsMonth = await getLastUpdateMangas(db, {mangaOrderBy: {field: 'view_month', sort: 'desc'}, pageSize: 5, getOnlyResult: true});
    const topViewsAll = await getLastUpdateMangas(db, {mangaOrderBy: {field: 'view', sort: 'desc'}, pageSize: 5, getOnlyResult: true});
    return {
        props: {
            mangas: JSON.parse(JSON.stringify(mangas)),
            meta: meta,
            query: buildParams(context.query),
            topViews: JSON.parse(JSON.stringify(topViews)),
            topViewsMonth: JSON.parse(JSON.stringify(topViewsMonth)),
            topViewsAll: JSON.parse(JSON.stringify(topViewsAll)),
        }
    };
}

export default MangaList;
