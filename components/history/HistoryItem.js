import Image from 'next/image';
import { getChapterName, getImageSrc, getMangaRoute, getChapterRoute } from '@/lib/helper';
import CustomLink from '@/components/common/CustomLink';

const HistoryItem = (props) => {
    const manga = props.manga;

    return (
        <div className="thumb-item-flow col-6 col-md-3">
            <div className="thumb-wrapper">
                <CustomLink href={getMangaRoute(manga)} title={manga.name}>
                    <div className="a6-ratio">
                        <Image src={getImageSrc(manga.image)} alt={manga.name} width={165} height={240} />
                    </div>
                </CustomLink>
                <div className="thumb-detail">
                    <div className="thumb_attr chapter-title text-truncate" title={getChapterName(manga.chapter.name)}>
                        <CustomLink href={getChapterRoute(manga, manga.chapter)} title={getChapterName(manga.chapter.name)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-double-right" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708z"/>
                                <path fillRule="evenodd" d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708z"/>
                            </svg>
                            <span> {getChapterName(manga.chapter.name)}</span>
                        </CustomLink>
                    </div>
                </div>
                <div className="action-wrapper">
                    <button onClick={() => props.deleteHistory(manga.id)} className="btn btn-xs btn-danger d-flex-align-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle-fill mr-1" viewBox="0 0 16 16">
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
                        </svg>
                        Delete
                    </button>
                </div>
            </div>
            <div className="thumb_attr series-title">
                <a href={getMangaRoute(manga)} title={manga.name}>{manga.name}</a>
            </div>
        </div>
    )
}

export default HistoryItem;