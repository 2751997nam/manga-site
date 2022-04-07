import DB from '@/lib/db';
import Redis from '@/lib/redis';
import CardList from '@/components/common/CardList';
import Slider from '@/components/home/Slider';
import {buildFilters, getLastUpdateMangas, getPopularMangas, getTopViews} from '@/services/MangaListService';
import dynamic from 'next/dynamic'
import Head from 'next/head';
import  { getSiteName } from '@/lib/helper';

const TopView = dynamic(
    () => import('@/components/manga-detail/TopView'),
    { ssr: false }
);

const Tracking = dynamic(
    () => import('@/components/common/Tracking'),
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
                <title>{props.siteName + ' read manhwa, manga, manhua, webtoon online'}</title>
                <meta name="description" content="Read manhwa 18+, toptoon 69, hentai, pornwa, pornhwa, webtoon, manhwa, manhua, manga online free,  manga scans, manga raw lastest chap, chapter"></meta>
                <meta name="keywords" content={`Read manhwa 18+, toptoon 69, hentai, pornwa, pornhwa, webtoon 18+ online free at ${props.siteName}, update fastest chap, chapters, most full, synthesized 24h free with high-quality images. We hope to bring you happy moments. `}></meta>
                <meta property="og:type" content="website"></meta>
                <meta property="og:title" content={'Read Webtoons and Korean Manhwa in English Online Free at ' + props.siteName}></meta>
                <meta property="og:url" content={props.siteName == 'ManhwaPlus' ? 'https://manhwaplus.net' : 'https://toptoon69.com/'}></meta>
                <meta property="og:description" content="Read your favorite premium Korean Manhwa and Webtoons translated to English for free. Read high-quality Manhwa, Webtoon, and Adult Comics Online. Updated Daily!"></meta>
                <meta property="og:image" content={props.siteName == 'ManhwaPlus' ? 'https://manhwaplus.net/images/logo.png' : 'https://toptoon69.com/images/logo69.png'}></meta>
                <meta name="twitter:site" content={'@' + props.siteName}></meta>
                <meta name="twitter:creator" content={'@' + props.siteName}></meta>
                <meta property="twitter:card" content="summary_large_image"></meta>
                <meta property="twitter:url" content={props.siteName == 'ManhwaPlus' ? 'https://manhwaplus.net' : 'https://toptoon69.com/'}></meta>
                <meta property="twitter:title" content={'Read Webtoons and Korean Manhwa in English Online Free at ' + props.siteName}></meta>
                <meta property="twitter:description" content="Read your favorite premium Korean Manhwa and Webtoons translated to English for free. Read high-quality Manhwa, Webtoon, and Adult Comics Online. Updated Daily!"></meta>
                <meta property="twitter:image" content={props.siteName == 'ManhwaPlus' ? 'https://manhwaplus.net/images/logo.png' : 'https://toptoon69.com/images/logo69.png'}></meta>
                <link rel="canonical" href={props.siteName == 'ManhwaPlus' ? 'https://manhwaplus.net' : 'https://toptoon69.com'} />
            </Head>
            <h1 className="hidden">{props.siteName + ' read manhwa, manga, manhua, webtoon online'}</h1>
            <div className="col-md-12">
                <Slider mangas={populars}></Slider>
            </div>
            <div className="col-md-8">
                <CardList title="Last update manhwa" titleTag="h2" mangas={lastUpdates} seeMoreUrl="/manga"></CardList>
                <CardList title="Last update Raw" mangas={lastUpdateRaws} seeMoreUrl="/manga-genre-raw"></CardList>
                <CardList title="Last update Completed" mangas={lastUpdateCompleteds} seeMoreUrl="/manga-completed"></CardList>
            </div>
            <div className="col-md-4">
                <TopView siteName={props.siteName}></TopView>
            </div>
            <Tracking targetType="HOME"></Tracking>
        </div>
    )
}

export async function getServerSideProps(context) {
    const {req} = context;
    const siteName = getSiteName(req);
    if (context && context.query && context.query.clearCache) {
        await Redis.delete([context.query.clearCache]);
    }

    const db = DB();
    let populars = await Redis.getJson('populars', []);
    if (!populars || !populars.length) {
        populars = await getPopularMangas(db);
        Redis.setJson('populars', populars, 'EX', 6 * 3600);
    }
    let lastUpdates = await Redis.getJson('lastUpdates', []);
    if (!lastUpdates || !lastUpdates.length) {
        lastUpdates = await getLastUpdateMangas(db, {getOnlyResult: true, pageSize: 19});
        Redis.setJson('lastUpdates', lastUpdates);
    }

    let lastUpdateRaws = await Redis.getJson('lastUpdateRaws', []);
    if (!lastUpdateRaws || !lastUpdateRaws.length) {
        lastUpdateRaws = await getLastUpdateMangas(db, {categoryIds: [8], getOnlyResult: true, pageSize: 11});
        Redis.setJson('lastUpdateRaws', lastUpdateRaws, 'EX', 86400);
    }

    let lastUpdateCompleteds = await Redis.getJson('lastUpdateCompleteds', []);
    if (!lastUpdateCompleteds || !lastUpdateCompleteds.length) {
        lastUpdateCompleteds = await getLastUpdateMangas(db, {status: 'COMPLETED', getOnlyResult: true, pageSize: 7});
        Redis.setJson('lastUpdateCompleteds', lastUpdateCompleteds, 'EX', 86400);
    }

    return {
        props: {
            siteName: siteName,
            populars: JSON.parse(JSON.stringify(populars)),
            lastUpdates: JSON.parse(JSON.stringify(lastUpdates)),
            lastUpdateRaws: JSON.parse(JSON.stringify(lastUpdateRaws)),
            lastUpdateCompleteds: JSON.parse(JSON.stringify(lastUpdateCompleteds)),
        }
    };
}

export default HomePage;
