import CustomLink from './CustomLink';
import Image from 'next/image';
import { formatDate, getChapterName, getImageSrc, getMangaRoute, getChapterRoute } from '../../lib/hepler';
import { useCallback, useEffect, useState, useMemo } from 'react';
import PopUpManga from './PopUpManga';

const MangaItem = (props) => {
    const [showPopup, setShowPopup] = useState(false);
    const [mangaDetail, setMangaDetail] = useState(null);
    const [coord, setCoord] = useState({x: 0, y: 0});
    const manga = props.manga;

    const onMouseEnter = (manga) => {
        setShowPopup(false);
        if (mangaDetail && manga.id == mangaDetail.id) {
            setShowPopup(true);
        } else {
            fetch('/api/manga-detail/' + manga.id)
                .then(res => res.json())
                .then(res => {
                    setMangaDetail({ ...res.result, updateTime: formatDate(manga.chapter.created_at) });
                    setShowPopup(true)
                })
        }
    }

    const onMouseMove = (event) => {
        setCoord({
            x: event.clientX,
            y: event.clientY
        })
    }

    const renderMangaPopup = useCallback((showPopup) => {
        if (showPopup && coord.x && coord.y) {
            return <PopUpManga manga={mangaDetail} coord={coord}></PopUpManga>
        }
        return '';
    }, [mangaDetail, coord]);

    const onMouseLeave = () => {
        setShowPopup(false);
    }

    useEffect(() => {
        renderMangaPopup(showPopup);
    }, [showPopup, renderMangaPopup])

    return (
        <div className="thumb-item-flow col-6 col-md-3">
            <div onMouseMove={onMouseMove} onMouseEnter={() => onMouseEnter(manga)} onMouseLeave={onMouseLeave}>
                <Manga manga={manga}></Manga>
            </div>
            {renderMangaPopup(showPopup)}
        </div>
    )

}

const Manga = ({manga}) => {
    const renderManga = useMemo(() => {
        const updateTime = formatDate(manga.chapter.created_at);
        return (
            <>
                <div className="thumb-wrapper">
                    <CustomLink href={getMangaRoute(manga)} title={manga.name}>
                        <div className="a6-ratio">
                            <Image src={getImageSrc(manga.image)} alt={manga.name} width={165} height={240} />
                        </div>
                    </CustomLink>
                    <div className="thumb-detail">
                        <div className="chapter-title text-truncate" title="Chapter 45">
                            <CustomLink href={getChapterRoute(manga, manga.chapter)} title={manga.name}>{manga.chapter ? getChapterName(manga.chapter.name) : ''}</CustomLink>
                        </div>
                    </div>
                    <div className="manga-badge">
                        <span className="badge badge-info">
                            <time className="timeago" title={updateTime}>{updateTime}</time>
                        </span>
                    </div>
                </div>
                <div className="thumb_attr series-title">
                    <CustomLink href={getMangaRoute(manga)} title={manga.name}>{manga.name}</CustomLink>
                </div>
            </>
        )
    }, [manga]);

    return <>{renderManga}</>
}

export default MangaItem;