import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import Image from 'next/image';
import { formatDate, getChapterName, getImageSrc, getMangaRoute, getChapterRoute } from '@/lib/helper';
import CustomLink from '@/components/common/CustomLink';

function Slider(props) {
    const mangas = props.mangas;

    const sliderResponsive = {
        0:{
            items: 2,
        },
        768:{
            items: 3
        },
        1024:{
            items: 5,
        },
        1366: {
            items: 5
        },
        1080: {
            items: 5
        }
    }

    const renderMangas = () => {
        return mangas.map(item => {
            const chapterName = getChapterName(item.chapter.name);
            const updateTime = formatDate(item.chapter.created_at);
            return (
                <div className="item" key={item.id}>
                    <div className="popular-thumb-item col-12">
                        <div className="thumb-wrapper">
                            <CustomLink href={getMangaRoute(item)}>
                                <div className="a6-ratio">
                                    <Image className="content img-in-ratio" src={getImageSrc(item.image)} alt={item.name} width={200} height={300} loading="eager" ></Image>
                                </div>
                            </CustomLink>
                            <div className="thumb-detail">
                                <div className="thumb_attr chapter-title text-truncate" title={chapterName}>
                                    <CustomLink href={getChapterRoute(item, item.chapter)} title={chapterName}>{chapterName}</CustomLink>
                                </div>
                            </div>
                            <div className="manga-badge">
                                <span className="badge badge-info">
                                    <time className="timeago" title={updateTime}>{updateTime}</time>
                                </span>
                            </div>
                        </div>
                        <div className="thumb_attr series-title">
                            <CustomLink href={getMangaRoute(item)} title={item.name}>{item.name}</CustomLink>
                        </div>
                    </div>
                </div>
            )
        })

    }
    return (
        <div className='card'>
            <div className='card-header'>
                <h3 className="card-title font-title">
                    <i className="fa fa-fire" aria-hidden="true"></i>  &nbsp; 
                    Popular manga			
                </h3>
            </div>
            <div className='card-body'>
                <OwlCarousel 
                    className='row owl-carousel owl-theme owl-drag' 
                    responsive={sliderResponsive}
                    items={5} 
                    slideBy={3} 
                    loop={true} 
                    autoplay={true} 
                    autoplayTimeout={5000} 
                    autoplayHoverPause={true}
                >
                    {renderMangas()}
                </OwlCarousel>
            </div>
        </div>
    )
}

export default Slider;