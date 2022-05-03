/* eslint-disable react/display-name */
import DB from '@/lib/db';
import mangaDetailStyles from '@/styles/manga-detail.module.css';
import CustomLink from '@/components/common/CustomLink';
import Image from 'next/image';
import BreadCrumb from '@/components/common/BreadCrumb';
import ChapterList from '@/components/manga-detail/ChapterList';
import SuggestManga from '@/components/manga-detail/SuggestManga';
import Head from 'next/head';
import { getImageSrc, getMangaRoute, getChapterRoute, getSiteName, getUserAgent } from '@/lib/helper';
import RatingBox from '@/components/manga-detail/RatingBox';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic'
import Script from 'next/script';
const Tracking = dynamic(
    () => import('@/components/common/Tracking'),
    { ssr: false }
);

function MangaDetail(props) {
    const router = useRouter();
    const manga = props.manga;
    const [bookmarkCount, setBookmarkCount] = useState(manga.bookmark_count);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const chapters = props.chapters;
    const categories = props.categories;
    const translators = props.translators;
    const authors = props.authors;
    const sameGroupMangas = props.sameGroupMangas;
    const sameCategoryMangas = props.sameCategoryMangas;
    const lastChapter = chapters[0];

    const links = [
        {url: '/manga', text: 'List Manga'},
        {url: getMangaRoute(manga), text: `Read ${manga.name}`}
    ];

    const renderInfo = (items, baseUrl, className) => {
        if (!items.length) {
            return (<span> Updating</span>)
        }
        return items.map(item => {
            return (
                <CustomLink className={'btn btn-xs ' + className} href={baseUrl + item.slug} key={item.id}>{item.name}</CustomLink> 
            )
        })
    }

    const checkBookmarked = useCallback(() => {
        let bookmarkedStr = localStorage.getItem('manhwa_bookmark');
        let bookmarkeds = (bookmarkedStr + '').split(',');
        for (let item of bookmarkeds) {
            if (bookmarkeds.includes(manga.id)) {
                setIsBookmarked(true);
                break;
            }
        }
    }, [manga]);

    const bookmark = () => {
        setBookmarkCount(bookmarkCount + 1);
        let bookmarkedStr = localStorage.getItem('manhwa_bookmark');
        let bookmarkeds = (bookmarkedStr + '').split(',');
        bookmarkeds.unshift(manga.id);
        bookmarkeds = [...new Set(bookmarkeds)];
        localStorage.setItem('manhwa_bookmark', bookmarkeds.join(','));
        setIsBookmarked(true);
        fetch('/api/bookmark', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({manga_id: manga.id})
        });
    }

    const removeBookmark = () => {
        setBookmarkCount(bookmarkCount - 1);
        let bookmarkedStr = localStorage.getItem('manhwa_bookmark');
        let bookmarkeds = (bookmarkedStr + '').split(',');
        bookmarkeds = bookmarkeds.filter(item => item != manga.id);
        bookmarkeds = [...new Set(bookmarkeds)];
        localStorage.setItem('manhwa_bookmark', bookmarkeds.join(','));
        setIsBookmarked(false);
    }

    const increaseView = (manga) => {
        fetch('/api/manga-view/' + manga.id, {
            method: 'POST'
        })
    }

    useEffect(() => {
        increaseView(manga);
    }, [router.asPath, manga])

    useEffect(() => {
        checkBookmarked();
    }, [checkBookmarked])

    return (
        <div className="row">
            <Head>
                <title>{manga.name}</title>
                <meta name="title" content={manga.name}></meta>
                <meta name="description" content={`Read ${manga.name} manhwa online, read ${manga.alt_name} manhwa online, read ${manga.name} webtoon free, read ${manga.alt_name} webtoon free lastest chap, chapter`}></meta>
                <meta name="keywords" content={`${manga.name}, ${manga.alt_name}, read ${manga.name}, read ${manga.alt_name}`}></meta>
                <link rel="canonical" href={(props.siteName == 'ManhwaPlus' ? 'https://manhwaplus.net/' : 'https://toptoon69.com/') + `manga/${manga.slug}`} />
            </Head>
            <div id="fb-root"></div>
            <Script async defer crossorigin="anonymous" src="https://connect.facebook.net/vi_VN/sdk.js#xfbml=1&version=v13.0" nonce="0RNU9HA4"></Script>
            <BreadCrumb links={links}></BreadCrumb>
            <h1 className="hidden">{manga.name}</h1>
            <div className="col-md-8 mt-2">
                <div className="card">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-4">
                                <div className="info-cover">
                                    <Image className='thumbnail img-fluid' width="180" height="260" src={getImageSrc(manga.image)} alt={manga.name}></Image>
                                    <RatingBox mangaId={manga.id} ratingCount={manga.rating_count} ratingValue={manga.rating} />
                                </div>
                            </div>
                            <div className="col-md-8">
                                <ul className="manga-info list-unstyled m-0">
                                    <h3>{manga.name}</h3>
                                    <li className='text-white'>
                                        <b>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-people-fill mr-1" viewBox="0 0 16 16">
                                                <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                                                <path fillRule="evenodd" d="M5.216 14A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216z"/>
                                                <path d="M4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/>
                                            </svg> Other Names
                                        </b>: 
                                        {manga.alt_name}
                                    </li>
                                    <li className='text-white d-flex-start'>
                                        <b>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-people-fill mr-1" viewBox="0 0 16 16">
                                                <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                                                <path fillRule="evenodd" d="M5.216 14A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216z"/>
                                                <path d="M4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/>
                                            </svg> Author(s)
                                        </b>: 
                                        {renderInfo(authors, '/manga-author-', 'btn-info m-1')}
                                    </li>
                                    <li className='text-white'>
                                        <b>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-tags-fill mr-1" viewBox="0 0 16 16">
                                                <path d="M2 2a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 2 6.586V2zm3.5 4a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/>
                                                <path d="M1.293 7.793A1 1 0 0 1 1 7.086V2a1 1 0 0 0-1 1v4.586a1 1 0 0 0 .293.707l7 7a1 1 0 0 0 1.414 0l.043-.043-7.457-7.457z"/>
                                            </svg>
                                            Genre(s)
                                        </b>: 
                                        {renderInfo(categories, '/manga-genre-', 'btn-danger m-1')}
                                    </li>
                                    <li className='text-white d-flex-start'>
                                        <b>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-clockwise mr-1" viewBox="0 0 16 16">
                                                <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                                                <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
                                            </svg>
                                            Status
                                        </b>: 
                                        <a href={'/manga-' + manga.status.toLowerCase()} className="btn btn-xs btn-success m-1">{manga.status == 'COMPLETED' ? 'Completed' : 'On going'}</a>
                                    </li>
                                    <li className='text-white d-flex-start'>
                                        <b>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-people-fill mr-1" viewBox="0 0 16 16">
                                                <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                                                <path fillRule="evenodd" d="M5.216 14A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216z"/>
                                                <path d="M4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/>
                                            </svg>
                                            Scan/Translation group
                                        </b>: 
                                        {renderInfo(translators, '/manga-trans-group-', 'btn-success m-1')}
                                    </li>
                                    <li className='text-white d-flex-start'>
                                        <b>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye-fill mr-1" viewBox="0 0 16 16">
                                                <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
                                                <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
                                            </svg>
                                             Views
                                        </b>: {manga.view}
                                    </li>
                                    <li>
                                        <span className="text-orange text-sm-left">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bookmark-fill" viewBox="0 0 16 16">
                                                <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/>
                                            </svg>
                                            {bookmarkCount} bookmarked
                                        </span>
                                    </li>
                                </ul>
                                <br />
                                <div className="d-flex-align-cener">
                                    <div className="btn-group my-2">
                                        {
                                            isBookmarked ? 
                                            (
                                                <span type="button" onClick={removeBookmark} className="btn btn-primary" id="bookmark_btn" action="unbookmark">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bell-slash-fill mr-1" viewBox="0 0 16 16">
                                                      <path d="M5.164 14H15c-1.5-1-2-5.902-2-7 0-.264-.02-.523-.06-.776L5.164 14zm6.288-10.617A4.988 4.988 0 0 0 8.995 2.1a1 1 0 1 0-1.99 0A5.002 5.002 0 0 0 3 7c0 .898-.335 4.342-1.278 6.113l9.73-9.73zM10 15a2 2 0 1 1-4 0h4zm-9.375.625a.53.53 0 0 0 .75.75l14.75-14.75a.53.53 0 0 0-.75-.75L.625 15.625z"/>
                                                    </svg>
                                                    Delete this bookmark
                                                </span>
                                            ) : 
                                            (
                                                <span onClick={bookmark} className="btn btn-primary btn-md">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bookmark-fill mr-1" viewBox="0 0 16 16">
                                                        <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/>
                                                    </svg>
                                                    Bookmark
                                                </span>
                                            )
                                        }
                                    </div>

                                    <div id="bt-reading" className="read-action mx-2">
                                        {lastChapter && <CustomLink className="btn btn-danger btn-md" href={getChapterRoute(manga, lastChapter)}>
                                            Read the last chapter
                                        </CustomLink>}
                                    </div>
                                </div>
                                <div className="d-flex-align-cener">
                                    <div className="fb-share-button" 
                                        data-href="https://developers.facebook.com/docs/plugins/" 
                                        data-layout="button_count" data-size="large">
                                        <a 
                                            target="_blank" 
                                            rel="noreferrer"
                                            href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fplugins%2F&amp;src=sdkpreparse" 
                                            className="fb-xfbml-parse-ignore"
                                        >
                                            Share
                                        </a>
                                    </div>

                                    <a className="twitter-share-button"
                                        href="https://twitter.com/intent/tweet?text=Hello%20world"
                                        data-size="large"
                                    >
                                        Tweet
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr className="hr" />
                    <div className="summary-wrapper col-12">
                        <div className="series-summary">
                            <h3>Description</h3>
                            <div className="summary-content" dangerouslySetInnerHTML={{ __html: manga.description }}></div>
                            <div className="summary-more d-none more-state">
                                <div className="see_more">Show more</div>
                            </div>
                        </div>
                    </div>
                </div>
                <ChapterList chapters={chapters} manga={manga}></ChapterList>
            </div>
            <div className='col-md-4 mt-2'>
                {sameGroupMangas.length ? <SuggestManga siteName={props.siteName} mangas={sameGroupMangas} title="Same Translation Group"></SuggestManga> : ''}
                {sameCategoryMangas.length ? <SuggestManga siteName={props.siteName} mangas={sameCategoryMangas} title="Suggested Manhwa"></SuggestManga> : ''}
            </div>
            <Tracking targetType="MANGA" targetId={manga.id}></Tracking>
            <Script>{`window.twttr = (function(d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0],
                    t = window.twttr || {};
                if (d.getElementById(id)) return t;
                js = d.createElement(s);
                js.id = id;
                js.src = "https://platform.twitter.com/widgets.js";
                fjs.parentNode.insertBefore(js, fjs);

                t._e = [];
                t.ready = function(f) {
                    t._e.push(f);
                };

                return t;
                }(document, "script", "twitter-wjs"));`}</Script>
        </div>
    )
}

async function getRelations(mangaId, table, relationTable) {
    const db = DB();

    return await db.from(table)
        .join(relationTable, table + '.id', relationTable + `.${table}_id`)
        .where('manga_id', mangaId)
        .select(`${table}.*`);
}

export async function getServerSideProps(context) {
    const db = DB();
    const slug = context.params.slug;
    
    const manga = await db.from('manga')
        .where('slug', slug).
        select(['*'])
        .first();
    if (!manga || !manga.id) {
        return {
            notFound: true
        }
    }
    const id = manga.id;
    const authors = await getRelations(id, 'author', 'manga_n_author');

    const categories = await getRelations(id, 'category', 'manga_n_category');

    const translators = await getRelations(id, 'translator', 'manga_n_translator');

    const chapters = await db.from('chapter')
        .where('manga_id', id)
        .where('status', 'ACTIVE')
        .orderBy('sorder', 'desc')
        .groupBy('name', 'slug', 'sorder')
        .select(['name', 'slug', 'sorder', db.raw('max(created_at) as created_at')]);

    const translatorIds = translators.map(item => item.id);
    const categoryIds = categories.map(item => item.id);

    const sameGroupMangas = await db.from('manga')
        .join('manga_n_translator', 'manga.id', 'manga_n_translator.manga_id')
        .whereIn('manga_n_translator.translator_id', translatorIds)
        .where('manga_id', '!=', id)
        .limit(5)
        .distinct()
        .select(['manga.id', 'manga.name', 'manga.image', 'manga.slug', 'manga.description', 'manga.view']);
    const sameGroupIds = sameGroupMangas.map(item => item.id);
    const sameCategoryMangas = await db.from('manga')
        .join('manga_n_category', 'manga.id', 'manga_n_category.manga_id')
        .whereIn('manga_n_category.category_id', categoryIds)
        .whereNotIn('manga_id', sameGroupIds)
        .where('manga_id', '!=', id)
        .limit(5)
        .distinct()
        .select(['manga.id', 'manga.name', 'manga.alt_name', 'manga.image', 'manga.slug', 'manga.description', 'manga.view']);
    const siteName = getSiteName(context.req);
    const userAgent = getUserAgent(req);
    return {
        props: {
            siteName: siteName,
            userAgent: userAgent,
            manga: JSON.parse(JSON.stringify(manga)),
            chapters: JSON.parse(JSON.stringify(chapters)),
            categories: JSON.parse(JSON.stringify(categories)),
            translators: JSON.parse(JSON.stringify(translators)),
            authors: JSON.parse(JSON.stringify(authors)),
            sameGroupMangas: JSON.parse(JSON.stringify(sameGroupMangas)),
            sameCategoryMangas: JSON.parse(JSON.stringify(sameCategoryMangas))
        }
    };
}

export default MangaDetail;
