import DB from '@/lib/db';
import Redis from '@/lib/redis';
import { getBaseMeta, getMangaByChapters } from '@/services/MangaListService';

const get = async (request, response) => {
    const db = DB();
    let result = [];
    let meta = getBaseMeta();

    let chapterIds = request.query.chapter_ids;

    const pageId = request.query.page ? (request.query.page - 1) : 0;
    const pageSize = request.query.pageSize ? request.query.pageSize : 20;

    chapterIds = chapterIds.split(',');
    if (chapterIds.length) {
        let mangaByChapters = await getMangaByChapters(db, {chapterIds: chapterIds, page: pageId, pageSize: pageSize});
        meta = mangaByChapters.meta;
        result = mangaByChapters.mangas;
    }

    return response.json({
        status: 'successful',
        meta: meta,
        result: result
    });
}

export default get;