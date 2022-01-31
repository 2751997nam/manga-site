import DB from '@/lib/db';
import { currentDate } from '@/lib/hepler';

const post = async (request, response) => {
    if (request.method == "POST") {
        let params = request.body;
  
        let id = params.manga_id;

        const db = DB();
        let manga = await db.from('manga').where('id', id).first(['id', 'bookmark_count']);

        await db.from('manga').where('id', id).update({
            bookmark_count: ++manga.bookmark_count,
        });
    
        return response.json({
            status: 'successful',
            result: JSON.parse(JSON.stringify(manga))
        })
    }
}

export default post;