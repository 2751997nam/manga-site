import DB from '../lib/db';
import CardList from '../components/common/CardList';
import {buildFilters, getLastUpdateMangas, getPopularMangas} from '../services/MangaListService';
import dynamic from 'next/dynamic'
import TopView from '../components/manga-detail/TopView';
import Head from 'next/head';

const Slider = dynamic(
    () => import('../components/home/Slider'),
    // No need for SSR, when the module includes a library that only works in the
    // browser.
    { ssr: false }
  );

function HomePage(props) {
    const populars = props.populars;
    const lastUpdates = props.lastUpdates;
    const lastUpdateRaws = props.lastUpdateRaws;
    const lastUpdateCompleteds = props.lastUpdateCompleteds;
    const topViews = props.topViews;
    const topViewsMonth = props.topViewsMonth;
    const topViewsAll = props.topViewsAll;
    return (
        <div className="row">
            <Head>
                <title>Manhwa</title>
                <meta name="description" content="read manhwa online, read pornwa, manhwaonline, manga online free, free manga, manga reader, manga scans, manga raw, manga, manhwa, manhua"></meta>
                <meta name="keywords" content="Read manhwa pornwa online free at Mahwa18, update fastest, most full, synthesized 24h free with high-quality images. We hope to bring you happy moments. "></meta>
            </Head>
            <div className="col-md-12">
                <Slider mangas={populars}></Slider>
            </div>
            <div className="col-md-8">
                <CardList title="Last update manhwa" mangas={lastUpdates} seeMoreUrl="/manga"></CardList>
                <CardList title="Last update Raw" mangas={lastUpdateRaws} seeMoreUrl="/manga-genre-raw"></CardList>
                <CardList title="Last update Completed" mangas={lastUpdateCompleteds} seeMoreUrl="/manga-completed"></CardList>
            </div>
            <div className="col-md-4">
                <TopView topViewsDay={topViews} topViewsMonth={topViewsMonth} topViewsAll={topViewsAll}></TopView>
            </div>
        </div>
    )
}

export async function getServerSideProps(contex) {
    const db = DB();
    let populars = await getPopularMangas(db);
    let lastUpdates = await getLastUpdateMangas(db, {notCategoryId: 8, getOnlyResult: true, pageSize: 19});
    let lastUpdateRaws = await getLastUpdateMangas(db, {categoryId: 8, getOnlyResult: true, pageSize: 11});
    let lastUpdateCompleteds = await getLastUpdateMangas(db, {status: 'COMPLETED', getOnlyResult: true, pageSize: 7});

    const topViews = await getLastUpdateMangas(db, {mangaOrderBy: {field: 'view_day', sort: 'desc'}, pageSize: 5, getOnlyResult: true});
    const topViewsMonth = await getLastUpdateMangas(db, {mangaOrderBy: {field: 'view_month', sort: 'desc'}, pageSize: 5, getOnlyResult: true});
    const topViewsAll = await getLastUpdateMangas(db, {mangaOrderBy: {field: 'view', sort: 'desc'}, pageSize: 5, getOnlyResult: true});

    return {
        props: {
            populars: JSON.parse(JSON.stringify(populars)),
            lastUpdates: JSON.parse(JSON.stringify(lastUpdates)),
            lastUpdateRaws: JSON.parse(JSON.stringify(lastUpdateRaws)),
            lastUpdateCompleteds: JSON.parse(JSON.stringify(lastUpdateCompleteds)),
            topViews: JSON.parse(JSON.stringify(topViews)),
            topViewsMonth: JSON.parse(JSON.stringify(topViewsMonth)),
            topViewsAll: JSON.parse(JSON.stringify(topViewsAll)),
        }
    };
}

export default HomePage;
