import { useState, useEffect, useCallback } from "react";
import CustomLink from "@/components/common/CustomLink";
import { formatDate, getChapterName, getMangaRoute, getChapterRoute } from '@/lib/helper';
import { useRouter } from 'next/router';

const ChapterList = (props) => {
    const [sortUp, setSortUp] = useState(true);
    const [chapters, setChapters] = useState(props.chapters);
    const manga = props.manga;
    const router = useRouter();

    useEffect(() => {
        setChapters(props.chapters);
    }, [router.asPath, props.chapters])
    
    const reverseChapters = () => {
        chapters.reverse();
        setChapters(chapters.slice(0));
        setSortUp(!sortUp);
    }

    const renderChapters = useCallback(() => {
        return chapters.map(chapter => {
            return (
                <CustomLink href={getChapterRoute(manga, chapter)} title={chapter.name} key={chapter.id}>
                    <li>
                        <div className="chapter-name text-truncate">{getChapterName(chapter.name)}</div>
                        <div className="chapter-time">{formatDate(chapter.created_at)}</div>
                    </li>
                </CustomLink>
            )
        })
    }, [chapters, manga]);

    useEffect(() => {
        renderChapters();
    }, [chapters, renderChapters])

    return (
        <div className="card">
            <div className="card-header">
                <h3 className="card-title font-title">Chapters</h3>
                <a className="reverse float-right text-white" onClick={reverseChapters}>
                    {
                        sortUp ? <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-sort-up" viewBox="0 0 16 16">
                        <path d="M3.5 12.5a.5.5 0 0 1-1 0V3.707L1.354 4.854a.5.5 0 1 1-.708-.708l2-1.999.007-.007a.498.498 0 0 1 .7.006l2 2a.5.5 0 1 1-.707.708L3.5 3.707V12.5zm3.5-9a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zM7.5 6a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zm0 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zm0 3a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1z"/>
                    </svg>
                    : <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-sort-down" viewBox="0 0 16 16">
                        <path d="M3.5 2.5a.5.5 0 0 0-1 0v8.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L3.5 11.293V2.5zm3.5 1a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zM7.5 6a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zm0 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zm0 3a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1z"/>
                    </svg>
                    }
                </a>
            </div>
            <div className="card-body">
                <ul className="list-chapters at-series list-unstyled">
                    {renderChapters()}
                </ul>
            </div>
        </div>
    )
}

export default ChapterList;