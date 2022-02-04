import CustomLink from '@/components/common/CustomLink';
import Image from 'next/image';
import { formatDate, getChapterName, getImageSrc, getMangaRoute, getChapterRoute } from '@/lib/helper';

const TopViewItem = (props) => {
    const manga = props.manga;
    const chapterName = getChapterName(manga.chapter.name);
    return (
        <div className="sidebar-content">
            <CustomLink href={getMangaRoute(manga)}> 
                <Image src={getImageSrc(manga.image)} alt={manga.name} width="50" height="66" />
            </CustomLink>

            <h2 className="m-1">
                <CustomLink href={getMangaRoute(manga)}>{manga.name}</CustomLink>
            </h2>
            <div>
                <CustomLink href={getChapterRoute(manga, manga.chapter)}>{chapterName}</CustomLink>
            </div>
            <i>{formatDate(manga.chapter.created_at)}</i>
        </div>
    )
}

export default TopViewItem;