import {useState, useEffect} from "react";
import CustomLink from "@/components/common/CustomLink";
import Search from "@/components/Search/Search";
import Image from "next/image";

function Header(props) {
    const categories = props.categories;
    const siteName = props.siteName;
    const logo = siteName == 'TopToon69' ? 'logo69' : 'logo';
    const [expand, setExpand] = useState(false);

    const showDropdown = () => {
        setExpand(true);
    }

    const hideDropdown = () => {
        setTimeout(() => {
            setExpand(false);
        }, 300);
    }

    useEffect(() => {
        return () => {
            setExpand(false);
        }
    }, []);

    return (
        <nav id="sticky-navbar" className="main-header navbar navbar-expand navbar-dark navbar-primary">
            <div className="container">
                <CustomLink href="/" className="navbar-brand">
                    <Image src={`/images/${logo}.png`} alt="Logo" className="brand-image" width={160} height="45"  />
                </CustomLink>
                <div className="navbar-collapse collapse">
                    <ul className="navbar-nav mr-auto">
                        <li className={'nav-item ' + (expand ? 'show' : '')}>
                            <span data-toggle="dropdown" tabIndex={0} onFocus={showDropdown} onBlur={hideDropdown} aria-expanded="true" className="nav-link dropdown-toggle pointer">
                                <i className="fas fa-book-open"></i><span className="d-none d-lg-inline ml-1">Genre(s)</span>
                            </span>
                            <div className={'dropdown-menu manga-mega-menu genres-menu w-100 justify-content-center ' + (expand ? 'show' : '')}>
                                <div className="row no-gutters">
                                    {categories.map(item => {
                                        return (
                                            <div className="col-4 col-md-2" key={item.id}>
                                                <CustomLink className="dropdown-item genres-item" href={'/manga-genre-' + item.slug}>{item.name}</CustomLink>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </li>
                        <li className="nav-item ml-1">
                            <CustomLink href="/manga/bookmark" className="nav-link"><i className="far fa-bookmark"></i> <span className="d-none d-lg-inline">Bookmark</span></CustomLink>
                        </li>
                        <li className="nav-item ml-1">
                            <CustomLink href="/manga/history" className="nav-link"><i className="fa fa-history" aria-hidden="true"></i> <span className="d-none d-lg-inline">History</span></CustomLink>
                        </li>
                    </ul>
                </div>
                <ul className="navbar-nav ml-auto flex-row right-nav-wrapper">
                    <Search></Search>
                </ul>
            </div>
        </nav>
    )
}

export default Header;