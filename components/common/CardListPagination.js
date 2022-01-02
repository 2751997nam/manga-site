import { isMobile } from "mobile-device-detect";
import MangaItem from "../common/MangaItem";
import MangaItemMobile from "../common/MangaItemMobile";
import Card from "../common/Card";
import Pagination from "./Pagination";

const CardListPagination = (props) => {
    const title = props.title;
    const mangas = props.mangas;
    const meta = props.meta;
    const seeMoreUrl = props.seeMoreUrl;
    const query = props.query;

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

    return (
        <Card title={title}>
            <div className="row">
                {renderListManga(mangas)}
            </div>
            <Pagination meta={meta} query={query}></Pagination>
        </Card>
    )
}

export default CardListPagination;