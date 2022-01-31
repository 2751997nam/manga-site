import DB from '@/lib/db';
import Redis from '@/lib/redis';
import { getBaseMeta, getLastUpdateMangas } from '@/services/MangaListService';

const get = async (request, response) => {
    const db = DB();
    let result = [];
    let meta = getBaseMeta();

    let mangaIds = request.query.manga_ids;
    const pageId = request.query.page ? (request.query.page - 1) : 0;
    const pageSize = request.query.pageSize ? request.query.pageSize : 20;

    mangaIds = mangaIds.split(',');
    if (mangaIds.length) {
        let lastUpdateMangas = await getLastUpdateMangas(db, {mangaIds: mangaIds, page: pageId, pageSize: pageSize});
        meta = lastUpdateMangas.meta;
        result = lastUpdateMangas.mangas;
    }

    return response.json({
        status: 'successful',
        meta: meta,
        result: result
    });
}

export default get;