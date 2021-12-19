import MangaItem from "../common/MangaItem";
import Card from "../common/Card";
import Pagination from "./Pagination";

const CardListPagination = (props) => {
    const title = props.title;
    const mangas = props.mangas;
    const meta = props.meta;
    const seeMoreUrl = props.seeMoreUrl;
    const url = props.url;
    const query = props.query;

    const renderListManga = (mangas) => {
        return mangas.map(item => {
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
            <Pagination meta={meta} url={url} query={query}></Pagination>
        </Card>
    )
}

export default CardListPagination;