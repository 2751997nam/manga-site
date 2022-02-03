import DB from '@/lib/db';

const get = async (request, response) => {
    let params = request.query;
    let pageId = params.page_id ? params.page_id : 0;
    let pageSize = params.page_size ? params.page_size : 50;

    let retVal = {
        status: 'successful',
        meta: {
            has_next: false,
            page_size: pageSize,
            page_id: pageId,
            page_count: 0,
            total_count: 0
        },
        result: []
    }

    let db = DB();

    let total = await db.count('id as count').from(params.table).first();
    total = total.count;
    let pageCount = total > 0 ? Math.ceil(total / pageSize) : 0;
    retVal.meta.total_count = total;
    retVal.meta.page_count = pageCount;
    retVal.meta.has_next = pageId < pageCount;
    params.page_size = pageSize;
    params.page_id = pageId;

    let items = await buildResult(params);

    retVal.result = JSON.parse(JSON.stringify(items));

    return response.json(retVal);
}

const buildResult = async (params) => {
    let db = DB();

    let query = db.from(params.table);
    let fields = ['*'];
    if (params.fields) {
        fields = params.fields.split(',');
        for (let i in fields) {
            fields[i] = fields[i].trim();
        }
    }

    if (params.filters) {
        let extraFields = buildFilters(query, params.filters);
        fields = fields.concat(extraFields);
    }
    if (params.sorts) {
        buildSorts(query, params.sorts);
    }
    if (params.page_size > 0 && params.page_id >= 0) {
        query.limit(params.page_size).offset(params.page_size * params.page_id);
    }

    let items = await query.select(fields);

    return items;
}

const buildFilters = (query, param) => {
    let db = DB();
    let extraFields = [];
    let filters = param.split(',');
    let parameters = [
        '=~', //match
        '~', //like
        '!=',
        '!{', //not in
        '={',//in
        '=',
    ];
    for (let filter of filters) {
        for (let para of parameters) {
            if (filter.indexOf(para) > 0) {
                let values = filter.split(para);
                values[1] = values[1].trim();
                let hasFilter = false;
                switch (para) {
                    case '~':
                        if (values[1]) {
                            query.where(values[0], 'like', '%' + values[1].replace(/\'/g, "\'") + '%');
                        }
                        hasFilter = true;
                        break;
                    case '=~':
                        if (values[1]) {
                            let matchFields = values[0].split(';');
                            query.whereRaw(`MATCH(${matchFields.join(', ')}) AGAINST ('${values[1].replace(/\'/g, "\'")}')`);
                        }
                        hasFilter = true;
                        break;
                    case '=':
                        query.where(values[0], values[1]);
                        hasFilter = true;
                        break;
                    case '!=':
                        query.where(values[0], '!=', values[1]);
                        hasFilter = true;
                        break;
                    case '!{': {
                        let arr = values[1].split(';');
                        query.whereNotIn(values[0], arr);
                        hasFilter = true;
                        break;             
                    }
                    case '={': {
                        let arr = values[1].split(';');
                        query.whereIn(values[0], arr);
                        hasFilter = true;
                        break;             
                    }
                    case '!=': {
                        let arr = values[1].split(';');
                        query.whereIn(values[0], arr);
                        hasFilter = true;
                        break;    
                    }
                    default:
                        break;
                }
                if (hasFilter) {
                    break;
                }
            }
        }
    }

    return extraFields;
}

const buildSorts = async (query, param) => { 
    let sorts = param.split(",");
    for (let item of sorts) {
        if (item.indexOf('-') == 0) {
            query.orderBy(item.substr(1), 'desc');
        } else {
            query.orderBy(item, 'asc');
        }
    }
}

export default get;