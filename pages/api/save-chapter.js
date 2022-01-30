import DB from '../../lib/db';
import Config from '../../config';

const post = async (request, response) => {
    if (request.method == "POST") {
        let db = DB();
        let retVal = {
            status: 'fail',
            message: '',
            result: []
        };
        let params = request.body;
        let token = params.token;
        let fillables = [
            'manga_id',
            'name',
            'slug',
            'crawl_url',
            'sorder',
            'status',
            'images',
            'parse_images',
            'parse_status',
        ];
        if (token == Config.api_token) {
            let data = {};
            for (let key in params) {
                if (fillables.includes(key)) {
                    data[key] = params[key];
                }
            }
            if (Object.keys(data).length && data.name) {
                let result = await db.table('chapter').insert(data);
                retVal.result = result;
                retVal.status = 'successful';
            }
        } else {
            retVal.message = 'token mismatch';
        }

        return response.json(retVal);
    }
}

export default post;