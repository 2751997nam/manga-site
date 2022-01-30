import DB from '../../lib/db';

const post = async (request, response) => {
    if (request.method == "POST") {
        let params = request.body;
        let id = params.id;
        const db = DB();
        let manga = await db.from('manga').where('id', id).first(['id', 'rating_count', 'rating']);

        let count = manga.rating_count + 1;
        let value = manga.rating * manga.rating_count;
        value = (value + params.rate) / count;

        await db.from('manga').where('id', id).update({
            rating_count: count,
            rating: value,
        });

        return response.json({
            status: 'successful',
            result: JSON.parse(JSON.stringify({
                rating_count: count,
                rating: value,
            }))
        })
    }
}

export default post;