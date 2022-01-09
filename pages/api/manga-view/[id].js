import DB from '../../../lib/db';
import { currentDate } from '../../../lib/hepler';

const post = async (request, response) => {
    if (request.method == "POST") {
        let params = request.query;
        let id = params.id;
        const db = DB();
        let manga = await db.from('manga').where('id', id).first(['id', 'view', 'view_day', 'view_month']);
        let month = currentDate(false);
        let date = currentDate();

        let view = await db.from('view').where('manga_id', id).where('date', date).first();
        let sumViewMonth = await db.from('view').where('manga_id', id).where('month', month).select(db.raw('sum(view) as sum')).first();
        let viewDay = 0;
        let viewMonth = 0;
        if (!view) {
            let viewData = {
                date: date,
                month: month,
                view: 1,
                manga_id: id
            }
            await db.from('view').insert(viewData);
            viewDay = 1;
        } else {
            view.view++;
            await db.from('view').where('manga_id', id).update({
                date: date,
                month: month,
                view: view.view
            });
            viewDay = view.view;
        }
        if (!sumViewMonth.sum) {
            viewMonth = 1;
        } else {
            viewMonth = sumViewMonth.sum + 1;
        }
        manga.view++;
        manga.view_day = viewDay;
        manga.view_month = viewMonth;
        await db.from('manga').where('id', id).update({
            view: manga.view,
            view_day: manga.view_day,
            view_month: manga.view_month,
        });
    
        return response.json({
            status: 'successful',
            result: JSON.parse(JSON.stringify(manga))
        })
    }
}

export default post;