/* eslint-disable react/display-name */
import DB from '../../../lib/db';
import mangaDetailStyles from '../../../styles/manga-detail.module.css';
import CustomLink from '../../../components/common/CustomLink';
import Image from 'next/image';
import BreadCrumb from '../../../components/common/BreadCrumb';
import ChapterList from '../../../components/manga-detail/ChapterList';
import SuggestManga from '../../../components/manga-detail/SuggestManga';
import Head from 'next/head';
import { getImageSrc, getMangaRoute, getChapterRoute } from '../../../lib/hepler';
import RatingBox from '../../../components/manga-detail/RatingBox';

function MangaDetail(props) {
    const manga = props.manga;
    const chapters = props.chapters;
    const categories = props.categories;
    const translators = props.translators;
    const authors = props.authors;
    const sameGroupMangas = props.sameGroupMangas;
    const sameCategoryMangas = props.sameCategoryMangas;
    const lastChapter = chapters[0];

    const links = [
        {url: '/manga', text: 'List Manga'},
        {url: getMangaRoute(manga), text: manga.name}
    ];

    const renderInfo = (items, baseUrl, className) => {
        if (!items.length) {
            return (<span> Updating</span>)
        }
        return items.map(item => {
            return (
                <CustomLink className={'btn btn-xs ' + className} href={baseUrl + item.slug} key={item.id}>{item.name}</CustomLink> 
            )
        })
    }

    return (
        <div className="row">
            <Head>
                <title>{manga.name}</title>
                <meta name="description" content={manga.description}></meta>
                <meta name="keywords" content="Read manhwa pornwa online free at Mahwa18, update fastest, most full, synthesized 24h free with high-quality images. We hope to bring you happy moments. "></meta>
            </Head>
            <BreadCrumb links={links}></BreadCrumb>

            <div className="col-md-8 mt-2">
                <div className="card">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-4">
                                <div className="info-cover">
                                    <Image className='thumbnail img-fluid' width="180" height="260" src={getImageSrc(manga.image)} alt={manga.name}></Image>
                                    <RatingBox mangaId={manga.id} ratingCount={manga.rating_count} ratingValue={manga.rating} />
                                </div>
                            </div>
                            <div className="col-md-8">
                                <ul className="manga-info list-unstyled m-0">
                                    <h3>{manga.name}</h3>
                                    <li>
                                        <b><i className="fa fa-users fa-md text-white" aria-hidden="true"></i> Author(s)</b>: 
                                        {renderInfo(authors, '/manga-author-', 'btn-info m-1')}
                                    </li>
                                    <li>
                                        <b><i className="fa fa-tags fa-md text-white" aria-hidden="true"></i> Genre(s)</b>: 
                                        {renderInfo(categories, '/manga-genre-', 'btn-danger m-1')}
                                    </li>
                                    <li>
                                        <b><i className="fa fa-spinner fa-md text-white"></i> Status</b>: 
                                        <a href={'/manga-' + manga.status.toLowerCase()} className="btn btn-xs btn-success m-1">{manga.status == 'COMPLETED' ? 'Completed' : 'On going'}</a>
                                    </li>
                                    <li>
                                        <b><i className="fa fa-user-plus fa-md text-white" aria-hidden="true"></i> Scan/Translation group</b>: 
                                        {renderInfo(translators, '/manga-trans-group-', 'btn-success m-1')}
                                    </li>
                                    <li>
                                        <b><i className="fa fa-eye fa-md text-white" aria-hidden="true"></i> Views</b>: {manga.view}
                                    </li>
                                    <li></li>
                                </ul>
                                <br />
                                <div className="btn-group my-2">
                                    <a href="account/login" className="btn btn-primary btn-md"><i className="fa fa-bookmark" aria-hidden="true"></i> Bookmark</a>
                                </div>

                                <div id="bt-reading" className="read-action">
                                    {lastChapter && <CustomLink className="btn btn-danger btn-md" href={getChapterRoute(manga, lastChapter)}>
                                        <i className="fa fa-paper-plane" aria-hidden="true"></i> 
                                        Read the last chapter
                                    </CustomLink>}
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr className="hr" />
                    <div className="summary-wrapper col-12">
                        <div className="series-summary">
                            <h3>Description</h3>
                            <div className="summary-content" dangerouslySetInnerHTML={{ __html: manga.description }}></div>
                            <div className="summary-more d-none more-state">
                                <div className="see_more">Show more</div>
                            </div>
                        </div>
                    </div>
                </div>
                <ChapterList chapters={chapters} manga={manga}></ChapterList>
            </div>
            <div className='col-md-4 mt-2'>
                {sameGroupMangas.length ? <SuggestManga mangas={sameGroupMangas} title="Same Translation Group"></SuggestManga> : ''}
                {sameCategoryMangas.length ? <SuggestManga mangas={sameCategoryMangas} title="Suggested Manhwa"></SuggestManga> : ''}
            </div>
        </div>
    )
}

async function getRelations(mangaId, table, relationTable) {
    const db = DB();

    return await db.from(table)
        .join(relationTable, table + '.id', relationTable + `.${table}_id`)
        .where('manga_id', mangaId)
        .select(`${table}.*`);
}

export async function getServerSideProps(context) {
    const db = DB();
    const slug = context.params.slug;
    
    const manga = await db.from('manga')
        .where('slug', slug).
        select(['*'])
        .first();
    if (!manga || !manga.id) {
        return {
            notFound: true
        }
    }
    const id = manga.id;
    const authors = await getRelations(id, 'author', 'manga_n_author');

    const categories = await getRelations(id, 'category', 'manga_n_category');

    const translators = await getRelations(id, 'translator', 'manga_n_translator');

    const chapters = await db.from('chapter')
        .where('manga_id', id)
        .where('status', 'ACTIVE')
        .orderBy('sorder', 'desc')
        .select(['id', 'name', 'slug', 'created_at']);

    const translatorIds = translators.map(item => item.id);
    const categoryIds = categories.map(item => item.id);

    const sameGroupMangas = await db.from('manga')
        .join('manga_n_translator', 'manga.id', 'manga_n_translator.manga_id')
        .whereIn('manga_n_translator.translator_id', translatorIds)
        .where('manga_id', '!=', id)
        .limit(5)
        .distinct()
        .select(['manga.id', 'manga.name', 'manga.image', 'manga.slug', 'manga.description', 'manga.view']);
    const sameGroupIds = sameGroupMangas.map(item => item.id);
    const sameCategoryMangas = await db.from('manga')
        .join('manga_n_category', 'manga.id', 'manga_n_category.manga_id')
        .whereIn('manga_n_category.category_id', categoryIds)
        .whereNotIn('manga_id', sameGroupIds)
        .where('manga_id', '!=', id)
        .limit(5)
        .distinct()
        .select(['manga.id', 'manga.name', 'manga.image', 'manga.slug', 'manga.description', 'manga.view']);
    return {
        props: {
            manga: JSON.parse(JSON.stringify(manga)),
            chapters: JSON.parse(JSON.stringify(chapters)),
            categories: JSON.parse(JSON.stringify(categories)),
            translators: JSON.parse(JSON.stringify(translators)),
            authors: JSON.parse(JSON.stringify(authors)),
            sameGroupMangas: JSON.parse(JSON.stringify(sameGroupMangas)),
            sameCategoryMangas: JSON.parse(JSON.stringify(sameCategoryMangas))
        }
    };
}

export default MangaDetail;