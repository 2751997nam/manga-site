import { isMobile } from "mobile-device-detect";
import MangaItem from "@/components/common/MangaItem";
import MangaItemMobile from "@/components/common/MangaItemMobile";
import Card from "@/components/common/Card";
import Pagination from "@/components/common/Pagination";
import HistoryItem from "@/components/history/HistoryItem";
import { useCallback, useState } from "react";

const HistoryCardListPagination = (props) => {
    const title = props.title;
    const [mangas, setMangas] = useState(props.mangas);
    const meta = props.meta;
    const query = props.query;

    const deleteHistory = (mangaId) => {
        setMangas(mangas.filter(item => item.id != mangaId));
        let historyStr = localStorage.getItem('manhwa_history');
        let history = {};
        try {
            history = JSON.parse(historyStr);
            if (!history) {
                history = {};
            }
        } catch (error) {

        }
        delete history[mangaId];

        localStorage.setItem('manhwa_history', JSON.stringify(history));
    }

    const renderListManga = useCallback(() => {
        console.log('renderListManga', mangas);
        return mangas.map(item => {
            return (
                <HistoryItem manga={item} key={item.id} deleteHistory={deleteHistory}></HistoryItem>
            )
        })
    }, [mangas])

    return (
        <Card title={title}>
            <div className="row">
                {renderListManga()}
            </div>
            <Pagination meta={meta} query={query}></Pagination>
        </Card>
    )
}

export default HistoryCardListPagination;