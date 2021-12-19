const buildFilters = async (db, params) => {
    let result = {};
    for (let key in params) {
        if (key != 'slug') {
            result[key] = params[key];
        } else {
            let value = params[key];
            if (value.indexOf('genre') == 0) {
                let slug = value.replace('genre-', '');
                let item = await db.from('category').where('slug', slug).select('id').first();
                if (item) {
                    result.categoryId = item.id;
                }
            } if (value.indexOf('author') == 0) {
                let slug = value.replace('author-', '');
                let item = await db.from('author').where('slug', slug).select('id').first();
                if (item) {
                    result.authorId = item.id;
                }
            } if (value.indexOf('trans-group') == 0) {
                let slug = value.replace('trans-group-', '');
                let item = await db.from('translator').where('slug', slug).select('id').first();
                if (item) {
                    result.translatorId = item.id;
                }
            } else if (value == 'completed' || value == 'active') {
                result['status'] = value;
            }
        }
    }

    return result;
}

const getLastUpdateMangas = async (db, filter = {}) => {
    const query = db.from('chapter');
    if (filter.categoryId) {
        query.join('category_n_manga', 'category_n_manga.manga_id', 'chapter.manga_id')
            .where('category_id', '=', filter.categoryId);
    }
    if (filter.authorId) {
        query.join('author_n_manga', 'author_n_manga.manga_id', 'chapter.manga_id')
            .where('author_id', '=', filter.authorId);
    }
    if (filter.translatorId) {
        query.join('manga_n_translator', 'manga_n_translator.manga_id', 'chapter.manga_id')
            .where('translator_id', '=', filter.translatorId);
    }
    query.join('manga', 'manga.id', 'chapter.manga_id')
    if (filter.status) {
        query.where('manga.status', '=', filter.status);
    }
    const pageId = filter.page ? (filter.page - 1) : 0;
    const pageSize = filter.pageSize ? filter.pageSize : 20;
    let meta = {};

    if (typeof filter.getOnlyResult == 'undefined' || !filter.getOnlyResult) {
        const totalQuery = query.clone();
        let total = await totalQuery.select(db.raw('count(distinct chapter.manga_id) as count')).first();
        total = total.count;
        const pageCount = total > 0 ? Math.ceil(total / pageSize) : 0;
        meta = {
            total: total,
            pageCount: pageCount,
            hasNext: pageId < pageCount,
            pageSize: pageSize,
            pageId: pageId
        }
    }
    query.select(db.raw('distinct chapter.manga_id, max(`chapter`.`updated_at`) as updated_at'))
        .where('chapter.status', '=', 'ACTIVE')
        .groupBy('chapter.manga_id')
        .orderBy('updated_at', 'desc');

    const lastUpdateMangas = await query.limit(pageSize).offset(pageId * pageSize);
    let mangaIds = [];
    for (let item of lastUpdateMangas) {
        mangaIds.push(item.manga_id);
    }
    const mangas = await db.from('manga')
        .select(['id', 'name', 'slug', 'image'])
        .whereIn('id', mangaIds);
    let mangaByIds = {};
    for (let manga of mangas) {
        mangaByIds[manga.id] = manga;
    }

    for (let item of lastUpdateMangas) {
        let chapter = await db.from('chapter')
            .where('manga_id', item.manga_id)
            .where('updated_at', item.updated_at)
            .select(['id', 'name', 'slug', 'manga_id', 'updated_at'])
            .first();
        if (chapter) {
            mangaByIds[chapter.manga_id].chapter = chapter;
        }
    }

    if (filter.getOnlyResult) {
        return Object.values(mangaByIds);
    }

    return {
        meta: meta,
        mangas: Object.values(mangaByIds)
    };
}

module.exports = {
    buildFilters: buildFilters,
    getLastUpdateMangas: getLastUpdateMangas
}