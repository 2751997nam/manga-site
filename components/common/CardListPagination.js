import { isMobile } from "react-device-detect";
import MangaItem from "@/components/common/MangaItem";
import MangaItemMobile from "@/components/common/MangaItemMobile";
import Card from "@/components/common/Card";
import Pagination from "@/components/common/Pagination";

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