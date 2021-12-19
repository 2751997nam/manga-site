/* eslint-disable react/display-name */
import mangaStyles from '../../styles/manga.module.css';
import CustomLink from '../../components/common/CustomLink';
import Image from 'next/image';
import CardListPagination from '../../components/common/CardListPagination';
import {buildFilters, getLastUpdateMangas} from '../../services/MangaListService';
import DB from '../../lib/db';

function MangaList(props) {
    const mangas = props.mangas;
    const meta = props.meta;
    const url = props.url;
    const query = props.query;

    return (
        <div className="row">
            <div className="col-md-8">
                <CardListPagination title="List Manga" mangas={mangas} meta={meta} url={url} query={query}></CardListPagination>
            </div>
            <div className='col-md-4'>

            </div>
        </div>
    )
}

const buildParams = (params) => {
    let result = {};
    for (let key in params) {
        if (key != 'slug') {
            result[key] = params[key];
        }
    }

    return result;
}

export async function getServerSideProps(context) {
    const db = DB();
    let url = context.req.url;
    let index = url.indexOf('?');
    if (index > 0) {
        url = url.substr(0, index);
    }
    const {mangas, meta} = await getLastUpdateMangas(db, await buildFilters(db, context.query));
    return {
        props: {
            mangas: JSON.parse(JSON.stringify(mangas)),
            meta: meta,
            url: url,
            query: buildParams(context.query)
        }
    };
}

export default MangaList;
