const buildFilters = async (db, params) => {
    let result = {};
    for (let key in params) {
        if (key == 'sort_by' && params.sort_type) {
            if (params[key] == 'created_at') {
                result.orderBy = {
                    field: params[key],
                    sort: params.sort_type
                }
            } else {
                result.mangaOrderBy = {
                    field: params[key],
                    sort: params.sort_type
                }
            }
        }
        else if (key != 'slug' && key != 'sort_type') {
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

const getLastUpdateChapters = async (db, mangaIds) => {
    const query = db.from('chapter');
    const lastUpdateMangas = await query.select(db.raw('distinct chapter.manga_id, max(`chapter`.`created_at`) as created_at'))
        .where('chapter.status', '=', 'ACTIVE')
        .whereIn('manga_id', mangaIds)
        .groupBy('chapter.manga_id');
    let chapters = [];
    for (let item of lastUpdateMangas) {
        let chapter = await db.from('chapter')
            .join('manga', 'manga.id', 'chapter.manga_id')
            .where('manga_id', item.manga_id)
            .where('chapter.created_at', item.created_at)
            .orderBy('chapter.created_at', 'desc')
            .orderBy('sorder', 'desc')
            .select(['chapter.id as chapter_id', 'chapter.name', 'chapter.slug', 'chapter.manga_id', 'chapter.created_at', 'manga.name as manga_name', 'manga.slug as manga_slug', 'manga.image as manga_image'])
            .first();
        chapters.push(chapter);
    }

    let result = [];
    for (let item of chapters) {
        let manga = {
            id: item.manga_id,
            name: item.manga_name,
            slug: item.manga_slug,
            image: item.manga_image,
            chapter: {
                id: item.chapter_id,
                manga_id: item.manga_id,
                name: item.name,
                slug: item.slug,
                created_at: item.created_at
            }
        }

        result.push(manga);
    }

    return result;
}

const getPopularMangas = async function (db, filter = {}) {
    const mangas = await db.from('manga')
        .select(['id'])
        .orderBy('view', 'desc')
        .limit(20);
    let mangaIds = mangas.map(item => item.id);

    let result = await getLastUpdateMangas(db, {mangaIds: mangaIds, getOnlyResult: true, pageSize: 10});

    return result;
}

const getLastUpdateMangas = async (db, filter = {}) => {
    const query = db.from('chapter');
    if (filter.categoryId) {
        query.join('manga_n_category', 'manga_n_category.manga_id', 'chapter.manga_id')
            .where('category_id', '=', filter.categoryId);
    }
    if (filter.notCategoryId) {
        query.join('manga_n_category', 'manga_n_category.manga_id', 'chapter.manga_id')
            .where('category_id', '!=', filter.notCategoryId);
    }
    if (filter.authorId) {
        query.join('manga_n_author', 'manga_n_author.manga_id', 'chapter.manga_id')
            .where('author_id', '=', filter.authorId);
    }
    if (filter.translatorId) {
        query.join('manga_n_translator', 'manga_n_translator.manga_id', 'chapter.manga_id')
            .where('translator_id', '=', filter.translatorId);
    }
    if (filter.mangaIds) {
        query.whereIn('chapter.manga_id', filter.mangaIds);
    }
    if (filter.status || filter.mangaOrderBy) {
        query.join('manga', 'manga.id', 'chapter.manga_id');
    }
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
    query.select(db.raw('distinct chapter.manga_id, max(`chapter`.`created_at`) as created_at'))
        .where('chapter.status', '=', 'ACTIVE')
        .groupBy('chapter.manga_id');
    if (filter.orderBy) {
        query.orderBy(filter.orderBy.field, filter.orderBy.sort);
    } else if (filter.mangaOrderBy) {
        query.orderBy('manga.' + filter.mangaOrderBy.field, filter.mangaOrderBy.sort);
    } else {
        query.orderBy('created_at', 'desc');
    }
    const lastUpdateMangas = await query.limit(pageSize).offset(pageId * pageSize);
    let chapters = [];
    for (let item of lastUpdateMangas) {
        let chapter = await db.from('chapter')
            .join('manga', 'manga.id', 'chapter.manga_id')
            .where('manga_id', item.manga_id)
            .where('chapter.created_at', item.created_at)
            .orderBy('chapter.created_at', 'desc')
            .orderBy('sorder', 'desc')
            .select(['chapter.id as chapter_id', 'chapter.name', 'chapter.slug', 'chapter.manga_id', 'chapter.created_at', 'manga.name as manga_name', 'manga.slug as manga_slug', 'manga.image as manga_image'])
            .first();
        chapters.push(chapter);
    }

    let result = [];
    for (let item of chapters) {
        let manga = {
            id: item.manga_id,
            name: item.manga_name,
            slug: item.manga_slug,
            image: item.manga_image,
            chapter: {
                id: item.chapter_id,
                manga_id: item.manga_id,
                name: item.name,
                slug: item.slug,
                created_at: item.created_at
            }
        }

        result.push(manga);
    }

    if (filter.getOnlyResult) {
        return Object.values(result);
    }

    return {
        meta: meta,
        mangas: Object.values(result)
    };
}

module.exports = {
    buildFilters: buildFilters,
    getPopularMangas: getPopularMangas,
    getLastUpdateChapters: getLastUpdateChapters,
    getLastUpdateMangas: getLastUpdateMangas
}