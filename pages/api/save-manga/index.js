import DB from '../../../lib/db';
import { slugify } from '../../../lib/util';
import Config from '../../../config';

const post = async (request, response) => {
    let retVal = {
        status: 'fail',
        message: '',
        result: []
    };
    if (request.method == "POST") {
        let db = DB();
        let params = request.body;
        let token = params.token;
        let fillables = [
            'id',
            'name',
            'alt_name',
            'slug',
            'image',
            'description',
            'crawl_url',
            'status',
            'view',
            'view_day',
            'view_month',
            'rating',
            'rating_count',
        ];
        if (token == Config.api_token) {
            let data = {};
            for (let key in params) {
                if (fillables.includes(key)) {
                    data[key] = params[key];
                }
            }
            if (Object.keys(data).length && data.slug) {
                let check = await db.table('manga').where('slug', data.slug).exists();
                if (check) {
                    let result = await db.table('manga').where('id', data.id).update(data);
                } else {
                    let result = await db.table('manga').insert(data);
                    if (params.categories) {
                        for (let item of params.categories) {
                            await this.saveRelation(result[0], item, 'category', 'manga_n_category', 'category_id');
                        }
                    }
                    if (params.authors) {
                        for (let item of params.authors) {
                            await this.saveRelation(result[0], item, 'author', 'manga_n_author', 'author_id');
                        }
                    }
                    if (params.translators) {
                        for (let item of params.translators) {
                            await this.saveRelation(result[0], item, 'translator', 'manga_n_translator', 'translator_id');
                        }
                    }
                }
                retVal.result = result;
                retVal.status = 'successful';
            }
        } else {
            retVal.message = 'token mismatch';
        }

        return response.json(retVal);
    } else {
        retVal.message = 'method not allowed';
        return response.json(retVal);
    }

}
const saveRelation = async (mangaId, name, table, pivot, column) => {
    let db = DB();
    let slug = slugify(name);
    let objID = await db.table(table)
        .where('slug', slug)
        .first();
    if (!objID) {
        objID = await db.table(table).insert({
            name: name,
            slug: slug,
        });
        objID = objID[0];
    } else {
        objID = objID.id;
    }
    let pivotObj = await db.table(pivot)
        .where('manga_id', mangaId)
        .where(column, objID)
        .first();
    if (!pivotObj) {
        let data = {};
        data.manga_id = mangaId;
        data[column] = objID;
        await db.table(pivot).insert(data);
    }
}

export default post;