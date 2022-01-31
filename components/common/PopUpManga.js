import Image from 'next/image';
import { getImageSrc } from '@/lib/hepler';

const PopUpManga = (props) => {
    const manga = props.manga;
    const coord = props.coord;
    const style = {
        left: (coord.x + 20) + 'px', 
        top: (coord.y + 20) +'px', 
        width: '500px'
    }

    const renderItems = (items) => {
        return items.map(item => {
            return (<span className="p-1" key={item.id}>{item.name}</span>)
        })
    }

    return (
        <div className="pop_manga" style={style}>
            <div className="pop_title">{manga.name}</div>
            <div className="pop_info clearfix">
                <div className='pop_info_img'>
                    <Image src={getImageSrc(manga.image)} alt={manga.name} width="100" height="140" />
                </div>
                <div className="group">
                    <small>
                        <p><strong>Other names:</strong>{manga.alt_name}</p>
                        <p><strong>Genre(s):</strong>{renderItems(manga.categories)}</p>
                        <p><strong>Author(s):</strong>{renderItems(manga.authors)}</p>
                        <p><strong>Last updated: </strong> <span>{manga.updateTime}</span></p>
                        <p><strong>Total views:</strong> <span>{manga.view}</span></p>
                    </small>
                </div>
            </div>
            <div className="pop_noidung">
                <strong>Description: </strong><br />
                <div dangerouslySetInnerHTML={{ __html: manga.description }}>
                </div>
            </div>
        </div>
    )
}

export default PopUpManga;