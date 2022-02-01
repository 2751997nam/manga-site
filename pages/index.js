import DB from '@/lib/db';
import Redis from '@/lib/redis';
import CardList from '@/components/common/CardList';
import {buildFilters, getLastUpdateMangas, getPopularMangas, getTopViews} from '@/services/MangaListService';
import dynamic from 'next/dynamic'
import TopView from '@/components/manga-detail/TopView';
import Head from 'next/head';

const Slider = dynamic(
    () => import('@/components/home/Slider'),
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
                <title>ManhwaPlus</title>
                <meta name="description" content="Read manhwa 18+, hentai, pornwa, manhwaonline, manga online free, free manga, manga reader, manga scans, manga raw, manga, manhwa, manhua"></meta>
                <meta name="keywords" content="Read manhwa 18+, hentai, pornwa online free at ManhwaPlus, update fastest, most full, synthesized 24h free with high-quality images. We hope to bring you happy moments. "></meta>
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
                <TopView></TopView>
            </div>
        </div>
    )
}

export async function getServerSideProps(context) {
    const db = DB();
    let populars = await Redis.getJson('populars', []);
    if (!populars || !populars.length) {
        populars = await getPopularMangas(db);
        Redis.setJson('populars', populars, 'EX', 6 * 3600);
    }
    let lastUpdates = await Redis.getJson('lastUpdates', []);
    if (!lastUpdates || !lastUpdates.length) {
        lastUpdates = await getLastUpdateMangas(db, {notCategoryId: 8, getOnlyResult: true, pageSize: 19});
        Redis.setJson('lastUpdates', lastUpdates);
    }

    let lastUpdateRaws = await Redis.getJson('lastUpdateRaws', []);
    if (!lastUpdateRaws || !lastUpdateRaws.length) {
        lastUpdateRaws = await getLastUpdateMangas(db, {categoryId: 8, getOnlyResult: true, pageSize: 11});
        Redis.setJson('lastUpdateRaws', lastUpdateRaws, 'EX', 86400);
    }

    let lastUpdateCompleteds = await Redis.getJson('lastUpdateCompleteds', []);
    if (!lastUpdateCompleteds || !lastUpdateCompleteds.length) {
        lastUpdateCompleteds = await getLastUpdateMangas(db, {status: 'COMPLETED', getOnlyResult: true, pageSize: 7});
        Redis.setJson('lastUpdateCompleteds', lastUpdateCompleteds, 'EX', 86400);
    }

    return {
        props: {
            populars: JSON.parse(JSON.stringify(populars)),
            lastUpdates: JSON.parse(JSON.stringify(lastUpdates)),
            lastUpdateRaws: JSON.parse(JSON.stringify(lastUpdateRaws)),
            lastUpdateCompleteds: JSON.parse(JSON.stringify(lastUpdateCompleteds)),
        }
    };
}

export default HomePage;
