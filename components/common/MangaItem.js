import CustomLink from './CustomLink';
import Image from 'next/image';
import { formatDate, getChapterName } from '../../lib/hepler';

const MangaItem = (props) => {
    const manga = props.manga;

    const updateTime = formatDate(manga.chapter.updated_at);

    return (
        <div className="thumb-item-flow col-6 col-md-3">
            <div className="thumb-wrapper">
                <CustomLink href={'/manga/' + manga.id} title={manga.name}>
                    <div className="a6-ratio">
                        <Image src={manga.image} alt={manga.name} width={165} height={240} />
                    </div>
                </CustomLink>
                <div className="thumb-detail">
                    <div className="chapter-title text-truncate" title="Chapter 45">
                        <CustomLink href={'/manga/' + manga.id} title={manga.name}>{manga.chapter ? getChapterName(manga.chapter.name) : ''}</CustomLink>
                    </div>
                </div>
                <div className="manga-badge">
                    <span className="badge badge-info">
                        <time className="timeago" title={updateTime}>{updateTime}</time>
                    </span>
                </div>
            </div>
            <div className="thumb_attr series-title">
                <CustomLink href={'/manga/' + manga.id} title={manga.name}>{manga.name}</CustomLink>
            </div>
        </div>
    )

}

export default MangaItem;