import { useState, useEffect, useCallback } from "react";
import CustomLink from "../common/CustomLink";
import { formatDate, getChapterName } from '../../lib/hepler';

const ChapterList = (props) => {
    const [sortUp, setSortUp] = useState(true);
    const [chapters, setChapters] = useState(props.chapters);
    
    const reverseChapters = () => {
        chapters.reverse();
        setChapters(chapters.slice(0));
        setSortUp(!sortUp);
    }

    const renderChapters = useCallback(() => {
        return chapters.map(chapter => {
            return (
                <CustomLink href={'/chapter/' + chapter.id} title={chapter.name} key={chapter.id}>
                    <li>
                        <div className="chapter-name text-truncate">{getChapterName(chapter.name)}</div>
                        <div className="chapter-time">{formatDate(chapter.created_at)}</div>
                    </li>
                </CustomLink>
            )
        })
    }, [chapters]);

    useEffect(() => {
        renderChapters();
    }, [chapters, renderChapters])

    return (
        <div className="card">
            <div className="card-header">
                <h3 className="card-title font-title">Chapters</h3>
                <a className="reverse float-right" onClick={reverseChapters}>
                    <i className={'fas fa-2x text-light ' + (sortUp ? 'fa-sort-amount-up-alt' : 'fa-sort-amount-down-alt')}></i>
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