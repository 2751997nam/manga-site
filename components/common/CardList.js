import { isMobile } from "react-device-detect";
import MangaItem from "@/components/common/MangaItem";
import MangaItemMobile from "@/components/common/MangaItemMobile";
import Card from "@/components/common/Card";
import CustomLink from "@/components/common/CustomLink";

const CardList = (props) => {
    const title = props.title;
    const mangas = props.mangas;
    const seeMoreUrl = props.seeMoreUrl;

    const renderListManga = (mangas) => {
        return mangas.map(item => {
            if (isMobile) {
                return (<MangaItemMobile manga={item} key={item.id}></MangaItemMobile>)
            }
            return (
                <MangaItem manga={item} key={item.id}></MangaItem>
            )
        })
    }

    const renderSeeMore = () => {
        if (seeMoreUrl) {
            return (
                <div className="thumb-item-flow col-6 col-md-3 see-more">
                    <div className="thumb-wrapper">
                        <div className="a6-ratio">
                            <div className="content img-in-ratio">
                                <CustomLink
                                    href={seeMoreUrl}
                                    title="See More"
                                >
                                    <div className="thumb-see-more">
                                        <div className="see-more-inside">
                                            <div className="see-more-content">
                                                <div className="see-more-icon">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" className="bi bi-arrow-right-circle-fill" viewBox="0 0 16 16">
                                                        <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/>
                                                    </svg>
                                                </div>
                                                <div className="see-more-text">See more</div>
                                            </div>
                                        </div>
                                    </div>
                                </CustomLink>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }

    return (
        <Card title={title}>
            <div className="row">
                {renderListManga(mangas)}
                {renderSeeMore()}
            </div>
        </Card>
    )
}

export default CardList;