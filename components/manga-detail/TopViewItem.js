import CustomLink from '../common/CustomLink';
import Image from 'next/image';
import { formatDate, getChapterName, getImageSrc } from '../../lib/hepler';

const TopViewItem = (props) => {
    const manga = props.manga;
    const chapterName = getChapterName(manga.chapter.name);
    return (
        <div className="sidebar-content">
            <CustomLink href={'/manga/' + manga.id}> 
                <Image src={getImageSrc(manga.image)} alt={manga.name} width="50" height="66" />
            </CustomLink>

            <h2 className="m-1">
                <CustomLink href={'/manga/' + manga.id}>{manga.name}</CustomLink>
            </h2>
            <div>
                <CustomLink href={'/chapter/' + manga.chapter.id}>{chapterName}</CustomLink>
            </div>
            <i>{formatDate(manga.chapter.created_at)}</i>
        </div>
    )
}

export default TopViewItem;