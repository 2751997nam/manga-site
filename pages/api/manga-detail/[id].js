import DB from '../../../lib/db';

const get = async (request, response) => {
    let params = request.query;
    let id = params.id;
    const db = DB();

    let manga = await db.from('manga').where('id', id).first(['id', 'name', 'slug', 'image', 'description', 'alt_name', 'view']);
    let authors = await db.from('author')
        .join('manga_n_author', 'manga_n_author.author_id', 'author.id')
        .where('manga_id', id)
        .select(['author.*']);
    let categories = await db.from('category')
        .join('manga_n_category', 'manga_n_category.category_id', 'category.id')
        .where('manga_id', id)
        .select(['category.*']);
    manga.authors = authors;
    manga.categories = categories;

    return response.json({
        status: 'successful',
        result: JSON.parse(JSON.stringify(manga))
    })
}

export default get;