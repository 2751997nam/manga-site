import DB from '../lib/db';
import CardList from '../components/common/CardList';
import {buildFilters, getLastUpdateMangas} from '../services/MangaListService';

function HomePage(props) {
    const lastUpdates = props.lastUpdates;
    const lastUpdateRaws = props.lastUpdateRaws;
    const lastUpdateCompleteds = props.lastUpdateCompleteds;
    return (
        <div className="row">
            <div className="col-md-8">
                <CardList title="Last update manhwa" mangas={lastUpdates} seeMoreUrl="/manga"></CardList>
                <CardList title="Last update Raw" mangas={lastUpdateRaws} seeMoreUrl="/manga-genre-raw"></CardList>
                <CardList title="Last update Completed" mangas={lastUpdateCompleteds} seeMoreUrl="/manga-completed"></CardList>
            </div>
            <div className="col-md-4">
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title font-title">
                            <i className="fa fa-comment" aria-hidden="true"></i> &nbsp;
                            New comment
                        </h3>
                    </div>
                </div>
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title font-title">
                            <i className="fas fa-history"></i> &nbsp;
                            Reading history
                        </h3>
                        <div className="float-right text-sm-left tiny-text"><a href="/manga-list.html?history=1"
                                className="link_right">views all »</a></div>
                    </div>
                    <span className="p-3">Log in to save your reading history</span>
                </div>

                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title font-title">
                            <i className="fab fa-facebook" aria-hidden="true"></i> &nbsp; Page Facebook
                        </h3>
                    </div>
                    <div className="card-body">
                    </div>
                </div>
            </div>
        </div>
    )
}

export async function getServerSideProps(contex) {
    const db = DB();
    let lastUpdates = await getLastUpdateMangas(db, {getOnlyResult: true, pageSize: 19});
    let lastUpdateRaws = await getLastUpdateMangas(db, {categoryId: 8, getOnlyResult: true, pageSize: 19});
    let lastUpdateCompleteds = await getLastUpdateMangas(db, {status: 'COMPLETED', getOnlyResult: true, pageSize: 19});

    return {
        props: {
            lastUpdates: JSON.parse(JSON.stringify(lastUpdates)),
            lastUpdateRaws: JSON.parse(JSON.stringify(lastUpdateRaws)),
            lastUpdateCompleteds: JSON.parse(JSON.stringify(lastUpdateCompleteds))
        }
    };
}

export default HomePage;
