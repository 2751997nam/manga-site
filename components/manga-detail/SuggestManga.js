import Image from 'next/image';
import CustomLink from '@/components/common/CustomLink';
import { getImageSrc, getMangaRoute, getChapterRoute } from '@/lib/helper';
import Script from 'next/script';
import { useMemo } from 'react';

function SuggestManga(props) {
    const mangas = props.mangas;
    const title = props.title;

    const renderAdsScript = useMemo(() => {
        if (props.siteName == 'ManhwaPlus') {
            return (
                <>
                    <ins className="adsbyexoclick" data-zoneid="4620562"></ins> 
                    <Script>{`(AdProvider = window.AdProvider || []).push({"serve": {}});`}</Script>
                </>
            )
        }

        return (
            <>
                <ins className="adsbyexoclick" data-zoneid="4615918"></ins>
                <Script>{`(AdProvider = window.AdProvider || []).push({"serve": {}});`}</Script>
            </>
        )
    }, [props])

    const stripTags = (html) => {
        return html.replace(/<[^>]+>/g, '');
    }

    const renderItems = () => {
        return mangas.map(item => {
            return (
                <li key={item.id}>
                    <div className="others-img no-padding">
                        <div className="a6-ratio">
                            <Image className="content img-in-ratio" src={getImageSrc(item.image)} alt={item.name} width={50} height={66}></Image>
                        </div>
                    </div>
                    <div className="others-info">
                        <h5 className="others-name">
                            <CustomLink href={getMangaRoute(item)}>{item.name}</CustomLink>
                        </h5>
                        <small className="series-summary">{stripTags(item.description).substr(0, 70)}...</small>
                    </div>
                </li>
            )
        })
    }

    if (!mangas.length) {
        return;
    }

    return (
        <div className="card">
            <div className="card-header">
                <h3 className="card-title font-title">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-book" viewBox="0 0 16 16">
                        <path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811V2.828zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492V2.687zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783z"/>
                    </svg>
                    &nbsp; {title}
                </h3>
            </div>
            <div className="card-body">
                <ul className="others-list">
                    {renderItems()}
                </ul>
                <div className="text-center mw-100-hidden">
                    <>{renderAdsScript}</>
                </div>
            </div>
        </div>

    )
}

export default SuggestManga;