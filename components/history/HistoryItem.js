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
                            <i className="fa fa-angle-double-right"></i> <i>{getChapterName(manga.chapter.name)}</i>
                        </CustomLink>
                    </div>
                </div>
                <div className="action-wrapper">
                    <button onClick={() => props.deleteHistory(manga.id)} className="btn btn-xs btn-danger"><i className="fa fa-times mr-1"></i>Delete</button>
                </div>
            </div>
            <div className="thumb_attr series-title">
                <a href={getMangaRoute(manga)} title={manga.name}>{manga.name}</a>
            </div>
        </div>
    )
}

export default HistoryItem;