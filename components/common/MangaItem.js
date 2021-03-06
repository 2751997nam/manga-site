import CustomLink from '@/components/common/CustomLink';
import Image from 'next/image';
import { formatDate, getChapterName, getImageSrc, getMangaRoute, getChapterRoute } from '@/lib/helper';
import { useCallback, useEffect, useState, useMemo } from 'react';
import PopUpManga from '@/components/common/PopUpManga';

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
        return (
            <>
                <div className="thumb-wrapper">
                    <CustomLink href={getMangaRoute(manga)} title={manga.name}>
                        <div className="a6-ratio">
                            <Image src={getImageSrc(manga.image)} alt={manga.name} width={149} height={224} />
                        </div>
                    </CustomLink>
                    <div className="thumb-detail">
                        <div className="chapter-title text-truncate" title={manga.chapter ? getChapterName(manga.chapter.name) : ''}>
                            <CustomLink href={getChapterRoute(manga, manga.chapter)} title={manga.name}>{manga.chapter ? getChapterName(manga.chapter.name) : ''}</CustomLink>
                        </div>
                    </div>
                    <div className="manga-badge">
                        <span className="badge badge-info">
                            <time className="timeago" title={formatDate(manga.chapter.created_at)} rel="nofollow">{formatDate(manga.chapter.created_at)}</time>
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