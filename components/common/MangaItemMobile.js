import { useCallback, useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import CustomLink from '@/components/common/CustomLink';
import { formatDate, getChapterName, getImageSrc, getMangaRoute, getChapterRoute } from '@/lib/helper';

const MangaItemMobile = (props) => {
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
        </div>
    )

}

export default MangaItemMobile;