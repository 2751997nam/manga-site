import Image from 'next/image';
import CustomLink from '@/components/common/CustomLink';
import { getImageSrc, getMangaRoute, getChapterRoute } from '@/lib/helper';

function SuggestManga(props) {
    const mangas = props.mangas;
    const title = props.title;

    const stripTags = (html) => {
        return html.replace(/<[^>]+>/g, '');
    }

    const renderItems = () => {
        return mangas.map(item => {
            return (
                <li key={item.id}>
                    <div className="others-img no-padding">
                        <div className="a6-ratio">
                            <Image className="content img-in-ratio" src={getImageSrc(item.image)} alt={item.name} width={50} height={66}></Image>
                        </div>
                    </div>
                    <div className="others-info">
                        <h5 className="others-name">
                            <CustomLink href={getMangaRoute(item)}>{item.name}</CustomLink>
                        </h5>
                        <small className="series-summary">{stripTags(item.description).substr(0, 70)}...</small>
                    </div>
                </li>
            )
        })
    }

    if (!mangas.length) {
        return;
    }

    return (
        <div className="card">
            <div className="card-header">
                <h3 className="card-title font-title"><i className="fa fa-book" aria-hidden="true"></i> &nbsp; {title}</h3>
            </div>
            <div className="card-body">
                <ul className="others-list">
                    {renderItems()}
                </ul>
                <div>
                    <ins className="adsbyexoclick" data-zoneid="4615918"></ins>
                </div>
            </div>
        </div>

    )
}

export default SuggestManga;