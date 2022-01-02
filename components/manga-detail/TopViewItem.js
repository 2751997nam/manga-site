import CustomLink from '../common/CustomLink';
import Image from 'next/image';
import { formatDate, getChapterName } from '../../lib/hepler';

const TopViewItem = (props) => {
    const manga = props.manga;
    const chapterName = getChapterName(manga.chapter.name);
    return (
        <div className="sidebar-content">
            <CustomLink href={'/manga/' + manga.id}> 
                <Image src={manga.image} alt={manga.name} width="50" height="66" />
            </CustomLink>

            <h2 className="m-1">
                <CustomLink href={'/manga/' + manga.id}>{manga.name}</CustomLink>
            </h2>
            <div>
                <CustomLink href={'/chapter/' + manga.chapter.id}>{chapterName}</CustomLink>
            </div>
            <i>{formatDate(manga.chapter.updated_at)}</i>
        </div>
    )
}

export default TopViewItem;