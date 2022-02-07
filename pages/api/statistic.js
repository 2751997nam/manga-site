import DB from '@/lib/db';

const get = async (request, response) => {
    const db = DB();
    let result = [];
    let params = request.query;
    let type = getParam(params.type, 'traffic');
    let format = getParam(params.format, 'hour');
    let dateFormat = format == 'hour' ? '%Y-%m-%d %H' : (format == 'day' ? '%Y-%m-%d' : format);
    let limit = getParam(params.limit, 100);
    if (type == 'traffic') {
        result = await db.table('tracking')
            .select(db.raw(`DATE_FORMAT(created_at, '${dateFormat}') as date, count(*) as count`))
            .where('user_agent', 'not like', '%bot%')
            .groupBy('date')
            .orderBy('date', 'desc')
            .limit(limit);
    } else if (type == 'user') {
        format = getParam(params.format, 'day');
        dateFormat = format == 'hour' ? '%Y-%m-%d %H' : (format == 'day' ? '%Y-%m-%d' : format);
        result = await db.select(db.raw('date, count(*) as count'))
            .from(db.raw(`(select DISTINCT ip, DATE_FORMAT(created_at, '${dateFormat}') as date from tracking where user_agent not like '%bot%') as A`))
            .groupBy('date')
            .orderBy('date', 'desc');
    }

    return response.json({
        status: 'successful',
        result: result
    });
}

const getParam = (value, defaultVal = null) => {
    if (value) {
        return value;
    }

    return defaultVal;
}

export default get;