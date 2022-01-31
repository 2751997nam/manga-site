import DB from '@/lib/db';
import Redis from '@/lib/redis';
import { getTopViews } from '@/services/MangaListService';

const get = async (request, response) => {
    const db = DB();
    const result = await getTopViews(db, Redis);

    return response.json({
        status: 'successful',
        result: result
    });
}

export default get;