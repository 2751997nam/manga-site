/* eslint-disable react/display-name */
import DB from '../../lib/db';
import { getChapterName } from '../../lib/hepler';
import chapterDetailStyles from '../../styles/chapter-detail.module.css';
import Link from 'next/link';
import Image from 'next/image';
import React, { useCallback, useEffect, useState } from 'react';
import BreadCrumb from '../../components/common/BreadCrumb';
import { useRouter } from 'next/router';
import CustomLink from '../../components/common/CustomLink';

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
        {url: '/manga/' + manga.id, text: manga.name},
        {url: '/chapter/' + chapter.id, text: getChapterName(chapter.name) }
    ];

    const renderChapterImages = () => {
        return chapter.images.map((image, index) => {
            return (
                <div className={chapterDetailStyles['page-item']} key={index}>
                    <img src={image.image_url} alt={chapter.name} />
                </div>
            )
        })
    }

    const changeChapter = (event) => {
        router.push('/chapter/' + event.target.value);
    }

    const renderChapterSelection = () => {
        return (
            <select className="form-control" value={chapter.id} onChange={changeChapter}>
                {chapters.map(item => {
                    return (
                        <option key={item.id} value={item.id}>{item.name}</option>
                    )
                })}
            </select>
        )
    }

    const getSideChapters = () => {
        let prevChapter = null;
        let nextChapter = null;

        for (let i = 0; i < chapters.length; i++) {
            if (chapters[i].id == chapter.id) {
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
    }

    const renderSideBarChapters = () => {
        return chapters.map(item => {
            return (
                <li key={item.id} className={item.id == chapter.id ? 'current' : ''} onClick={toggleSideBar}>
                    <CustomLink href={`/chapter/${item.id}`} title={chapter.name}>{getChapterName(item.name)}</CustomLink>
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

    useEffect(() => {
        window.addEventListener('scroll', handleOnScroll);
        return () => {
            window.removeEventListener('scroll', handleOnScroll)
        }
    }, [handleOnScroll])

    return (
        <div className='row'>
            <BreadCrumb links={links}></BreadCrumb>
            <div className='col-md-12 text-center'>
                <div className={chapterDetailStyles['container']}>
                    <div className={chapterDetailStyles['chapter-container']}>
                        {renderChapterImages()}
                    </div>
                </div>
            </div>
            <div className="col-md-12">
                <div className="input-group justify-content-center">
                    <div className="py-1">
                        <CustomLink className={'btn btn-info prev ' + (!prevChapter ? 'disabled' : '')} href={prevChapter ? `/chapter/${prevChapter.id}` : ''}>
                            <span className="fas fa-chevron-left"></span> Previous chapter
                        </CustomLink>
                    </div>

                    <div className="select-chapter p-1 w-100 mw-300">
                        {renderChapterSelection()}
                    </div>
                    <div className="py-1">
                        <CustomLink className={'btn btn-info next ' + (!nextChapter ? 'disabled' : '')} href={nextChapter ? `/chapter/${nextChapter.id}` : ''}>
                            Next chapter <span className="fas fa-chevron-right"></span>
                        </CustomLink>
                    </div>
                </div>
            </div>
            <section id="rd-side_icon" className={!showControl ? 'd-none' : ''}>
                <CustomLink className={'rd_sd-button_item rd_top-left prev ' + (!prevChapter ? 'disabled' : '')} href={prevChapter ? `/chapter/${prevChapter.id}` : ''}>
                    <i className="fa fa-fast-backward" aria-hidden="true"></i>
                </CustomLink>
                <CustomLink className="rd_sd-button_item" href="/">
                    <i className="fa fa-home" aria-hidden="true"></i>
                </CustomLink>
                <a id="rd-info_icon" onClick={toggleSideBar} className="rd_sd-button_item">
                    <i className="fa fa-bars" aria-hidden="true"></i>
                </a>
                <CustomLink className={'rd_sd-button_item rd_top-left next ' + (!prevChapter ? 'disabled' : '')} href={prevChapter ? `/chapter/${prevChapter.id}` : ''}>
                    <i className="fa fa-fast-forward" aria-hidden="true"></i>
                </CustomLink>
            </section>
            <section id="chapters" className={'rd_sidebar ' + (!showSideBar ? 'd-none' : '')}>
                <main className="rdtoggle_body">
                    <header className="rd_sidebar-header clear">
                        <a className='img'>
                            <Image src={manga.image} alt={manga.name} width="60" height="85"></Image>
                        </a>
                        <div className="rd_sidebar-name">
                            <h5>
                                <a href={`/manga/${manga.id}`}>{manga.name}</a>
                            </h5>
                        </div>
                    </header>
                    <ul id="chap_list" className="list-unstyled">
                        {renderSideBarChapters()}
                    </ul>
                </main>
                <div className="black-click" onClick={toggleSideBar}></div>
            </section>
        </div>
    )
}

export async function getServerSideProps(context) {
    const db = DB();
    const id = context.params.id;
    const chapter = await db.from('chapter').where('id', id).select(['*']).first();
    const manga = await db.from('manga').where('id', chapter.manga_id).select(['id', 'name', 'slug', 'image']).first();
    chapter.images = JSON.parse(chapter.images);

    const chapters = await db.from('chapter')
        .where('manga_id', chapter.manga_id)
        .where('status', 'ACTIVE')
        .orderBy('id', 'desc')
        .select(['id', 'name', 'slug']);
    return {
        props: {
            chapter: JSON.parse(JSON.stringify(chapter)),
            chapters: JSON.parse(JSON.stringify(chapters)),
            manga: JSON.parse(JSON.stringify(manga)),
        }
    };
}

export default ChapterDetail;
