import DB from '../../../lib/db';
import Config from '../../../config';

const put = async (request, response) => {
    let retVal = {
        status: 'fail',
        message: '',
        result: []
    };
    if (request.method == "PUT" || request.method == "PATCH") {
        let db = DB();
        let id = request.query.id;
        let params = request.body;
        let token = params.token;
        let fillables = [
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
            if (Object.keys(data).length) {
                await db.table('manga').where('id', id).update(data);
                retVal.result = data;
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

export default put;