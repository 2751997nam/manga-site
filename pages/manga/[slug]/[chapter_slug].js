/* eslint-disable react/display-name */
import DB from '@/lib/db';
import { getChapterName, getImageSrc, getMangaRoute, getChapterRoute, getSiteName } from '@/lib/helper';
import chapterDetailStyles from '@/styles/chapter-detail.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { useCallback, useEffect, useState, useMemo } from 'react';
import BreadCrumb from '@/components/common/BreadCrumb';
import { useRouter } from 'next/router';
import CustomLink from '@/components/common/CustomLink';
import CustomImage from '@/components/common/CustomImage';
import Head from 'next/head';
import Config from '@/config';
import dynamic from 'next/dynamic'
const Tracking = dynamic(
    () => import('@/components/common/Tracking'),
    { ssr: false }
);

function ChapterDetail(props) {
    const router = useRouter();
    const [showSideBar, setShowSideBar] = useState(false);
    const [lastScroll, setLastScroll] = useState(0);
    const [showControl, setShowControl] = useState(false);

    const chapter = props.chapter;
    const chapters = props.chapters;
    const manga = props.manga;

    const links = [
        {url: '/manga', text: 'List Manga'},
        {url: getMangaRoute(manga), text: manga.name},
        {url: getChapterRoute(manga, chapter), text: getChapterName(chapter.name) }
    ];

    const renderChapterImages = useCallback(() => {
        let images = chapter.images;
        if (
            Config.use_local_image &&
            // chapter.parse_status == 'ACTIVE' && 
            chapter.parse_images && 
            chapter.parse_images.length
        ) {
            images = chapter.parse_images;
        }
        return images.map((image, index) => {
            return (
                <div className={chapterDetailStyles['page-item']} key={`${chapter.id}-${index}`}>
                    <CustomImage 
                        src={image.image_url} 
                        error_src={getImageSrc(image.error_url)}
                        alt={chapter.name} 
                        layout='fill' 
                        quality={100} 
                        priority={index == 0} 
                        loading="eager" 
                        objectFit='contain' 
                        placeholder='blur' 
                        blurDataURL='/images/loading.gif' 
                    />
                </div>
            )
        })
    }, [chapter])

    const changeChapter = (event) => {
        router.push(event.target.value);
    }

    const renderChapterSelection = () => {
        return (
            <select className="form-control" value={getChapterRoute(manga, chapter)} onChange={changeChapter}>
                {chapters.map(item => {
                    return (
                        <option key={item.id} value={getChapterRoute(manga, item)}>{item.name}</option>
                    )
                })}
            </select>
        )
    }

    const getSideChapters = () => {
        let prevChapter = null;
        let nextChapter = null;
        for (let i = 0; i < chapters.length; i++) {
            if (chapters[i].slug == chapter.slug) {
                if (i > 0) {
                    nextChapter = chapters[i - 1];
                }
                if (i < chapters.length - 1) {
                    prevChapter = chapters[i + 1];
                }

                break;
            }
        }

        return {
            prevChapter: prevChapter,
            nextChapter: nextChapter
        }
    }

    const {prevChapter, nextChapter} = getSideChapters();

    const toggleSideBar = () => {
        setShowSideBar(!showSideBar);
        setTimeout(() => {
            let sideBar = document.querySelector('#chapters .rdtoggle_body');
            let element = document.getElementById('chapter-item-' + chapter.id);
            if (element) {
                element.scrollIntoView();
                sideBar.scrollTop = sideBar.scrollTop - 100;
            }
        }, 100);
    }

    const renderSideBarChapters = () => {
        return chapters.map(item => {
            return (
                <li key={item.id} id={'chapter-item-' + item.id } className={item.id == chapter.id ? 'current' : ''} onClick={toggleSideBar}>
                    <CustomLink href={getChapterRoute(manga, item)} title={chapter.name}>{getChapterName(item.name)}</CustomLink>
                </li>
            )
        })
    }

    const handleOnScroll = useCallback(() => {
        if (window.scrollY > lastScroll) {
            setShowControl(false)
        } else if (window.scrollY < lastScroll) {
            setShowControl(true)
        }
        setLastScroll(window.scrollY);
    }, [lastScroll, setLastScroll, setShowControl]);

    const increaseView = (chapter) => {
        fetch('/api/manga-view/' + chapter.manga_id, {
            method: 'POST'
        })
    }

    const saveHistory = (chapter) => {
        let historyStr = localStorage.getItem('manhwa_history');
        let history = {};
        try {
            history = JSON.parse(historyStr);
            if (!history) {
                history = {};
            }
        } catch (error) {
            
        }
        history[chapter.manga_id] = chapter.id;
        localStorage.setItem('manhwa_history', JSON.stringify(history));
    }

    useEffect(() => {
        window.addEventListener('scroll', handleOnScroll);
        return () => {
            window.removeEventListener('scroll', handleOnScroll)
        }
    }, [handleOnScroll])

    useEffect(() => {
        increaseView(chapter);
        saveHistory(chapter);
    }, [router.asPath, chapter])

    return (
        <div className='row'>
            <Head>
                <title>{chapter.name}</title>
                <meta name="title" content={chapter.name}></meta>
                <meta name="description" content={manga.description}></meta>
                <meta name="keywords" content={props.keywords}></meta>
                <link rel="canonical" href={(props.siteName == 'ManhwaPlus' ? 'https://manhwaplus.net/' : 'https://toptoon69.com/') + `manga/${manga.slug}/${chapter.slug}`} />
            </Head>
            <BreadCrumb links={links}></BreadCrumb>
            <h1 className="hidden">{chapter.name}</h1>
            <div className='col-md-12 text-center'>
                <div className='chapter-images'>
                    {renderChapterImages()}
                </div>
            </div>
            <div className="col-md-12">
                <div className="input-group justify-content-center">
                    <div className="py-1">
                        <CustomLink className={'btn btn-info prev ' + (!prevChapter ? 'disabled' : '')} href={prevChapter ? getChapterRoute(manga, prevChapter) : ''}>
                            <span className="fas fa-chevron-left"></span> Previous chapter
                        </CustomLink>
                    </div>

                    <div className="select-chapter p-1 w-100 mw-300">
                        {renderChapterSelection()}
                    </div>
                    <div className="py-1">
                        <CustomLink className={'btn btn-info next ' + (!nextChapter ? 'disabled' : '')} href={nextChapter ? getChapterRoute(manga, nextChapter) : ''}>
                            Next chapter <span className="fas fa-chevron-right"></span>
                        </CustomLink>
                    </div>
                </div>
            </div>
            <section id="rd-side_icon" className={!showControl ? 'd-none' : ''}>
                <CustomLink className={'rd_sd-button_item rd_top-left prev ' + (!prevChapter ? 'disabled' : '')} href={prevChapter ? getChapterRoute(manga, prevChapter) : ''}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-skip-backward-fill" viewBox="0 0 16 16">
                        <path d="M.5 3.5A.5.5 0 0 0 0 4v8a.5.5 0 0 0 1 0V8.753l6.267 3.636c.54.313 1.233-.066 1.233-.697v-2.94l6.267 3.636c.54.314 1.233-.065 1.233-.696V4.308c0-.63-.693-1.01-1.233-.696L8.5 7.248v-2.94c0-.63-.692-1.01-1.233-.696L1 7.248V4a.5.5 0 0 0-.5-.5z"/>
                    </svg>
                </CustomLink>
                <CustomLink className="rd_sd-button_item" href="/">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-house-fill" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293l6-6zm5-.793V6l-2-2V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5z"/>
                        <path fillRule="evenodd" d="M7.293 1.5a1 1 0 0 1 1.414 0l6.647 6.646a.5.5 0 0 1-.708.708L8 2.207 1.354 8.854a.5.5 0 1 1-.708-.708L7.293 1.5z"/>
                    </svg>
                </CustomLink>
                <span id="rd-info_icon" onClick={toggleSideBar} className="rd_sd-button_item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-list" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
                    </svg>
                </span>
                <CustomLink className={'rd_sd-button_item rd_top-left next ' + (!nextChapter ? 'disabled' : '')} href={nextChapter ? getChapterRoute(manga, nextChapter) : ''}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-skip-forward-fill" viewBox="0 0 16 16">
                        <path d="M15.5 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V8.753l-6.267 3.636c-.54.313-1.233-.066-1.233-.697v-2.94l-6.267 3.636C.693 12.703 0 12.324 0 11.693V4.308c0-.63.693-1.01 1.233-.696L7.5 7.248v-2.94c0-.63.693-1.01 1.233-.696L15 7.248V4a.5.5 0 0 1 .5-.5z"/>
                    </svg>
                </CustomLink>
            </section>
            <section id="chapters" className={'rd_sidebar ' + (!showSideBar ? 'd-none' : '')}>
                <main className="rdtoggle_body">
                    <header className="rd_sidebar-header clear">
                        <a className='img'>
                            <Image src={getImageSrc(manga.image)} alt={manga.name} width="60" height="85"></Image>
                        </a>
                        <div className="rd_sidebar-name">
                            <h5>
                                <a href={getMangaRoute(manga)}>{manga.name}</a>
                            </h5>
                        </div>
                    </header>
                    <ul id="chap_list" className="list-unstyled">
                        {renderSideBarChapters()}
                    </ul>
                </main>
                <div className="black-click" onClick={toggleSideBar}></div>
            </section>
            <Tracking targetType="CHAPTER" targetId={chapter.id}></Tracking>
        </div>
    )
}

export async function getServerSideProps(context) {
    const db = DB();
    const slug = context.params.chapter_slug;
    const chapter = await db.from('chapter').where('slug', slug).select(['*']).first();

    if (!chapter || !chapter.id) {
        return {
            notFound: true
        }
    }
    const id = chapter.id;

    const manga = await db.from('manga').where('id', chapter.manga_id).select(['id', 'name', 'slug', 'image']).first();
    chapter.images = JSON.parse(chapter.images);
    if (chapter.parse_images) {
        chapter.parse_images = JSON.parse(chapter.parse_images);
    }
    const chapters = await db.from('chapter')
        .where('manga_id', chapter.manga_id)
        .where('status', 'ACTIVE')
        .orderBy('sorder', 'desc')
        .groupBy('name', 'slug', 'sorder')
        .select(['name', 'slug', 'sorder', db.raw('max(created_at) as created_at')]);
    const {req} = context;
    const siteName = getSiteName(req);
    let keywords = `Read manhwa 18+, toptoon 69, hentai, pornwa, pornhwa, webtoon 18+ online free at ${siteName}, update fastest chap, chapters, most full, synthesized 24h free with high-quality images. We hope to bring you happy moments. `;
    return {
        props: {
            keywords: keywords,
            chapter: JSON.parse(JSON.stringify(chapter)),
            chapters: JSON.parse(JSON.stringify(chapters)),
            manga: JSON.parse(JSON.stringify(manga)),
        }
    };
}

export default ChapterDetail;
