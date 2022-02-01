import DB from '@/lib/db';
import { currentDate } from '@/lib/hepler';

const post = async (request, response) => {
    if (request.method == "POST") {
        let params = request.body;
        const db = DB();
        const date = currentDate();
        const targetType = params.target_type;
        const targetId = params.target_id;
        let query = db.from('tracking_view').where('target_type', targetType)
        if (targetId != undefined) {
            query.where('target_id', targetId);
        }
        let tracking = await query.where('date', date)
            .first(['id', 'view']);
        if (tracking) {
            await db.from('tracking_view').where('id', tracking.id).update({
                view: ++tracking.view,
            });
        } else {
            await db.from('tracking_view').insert({
                target_type: targetType,
                target_id: targetId,
                date: date,
                view: 1,
            });
        }
    
        return response.json({
            status: 'successful',
            result: JSON.parse(JSON.stringify(params))
        })
    }
}

export default post;