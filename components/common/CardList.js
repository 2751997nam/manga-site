import { isMobile } from "mobile-device-detect";
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
                                                    <i className="fa fa-arrow-right" aria-hidden="true"></i>
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