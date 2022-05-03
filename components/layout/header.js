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
        }, 100);
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
                            <span data-toggle="dropdown" tabIndex={0} onFocus={showDropdown} onBlur={hideDropdown} aria-expanded="true" className="nav-link d-flex-align-center dropdown-toggle pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-book" viewBox="0 0 16 16">
                                    <path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811V2.828zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492V2.687zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783z"/>
                                </svg>
                                <span className="d-none d-lg-inline ml-1">Genre(s)</span>
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
                            <CustomLink href="/manga/bookmark" className="nav-link d-flex-align-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bookmark" viewBox="0 0 16 16">
                                    <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z"/>
                                </svg>
                                <span className="d-none d-lg-inline">Bookmark</span>
                            </CustomLink>
                        </li>
                        <li className="nav-item ml-1">
                            <CustomLink href="/manga/history" className="nav-link d-flex-align-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-hourglass" viewBox="0 0 16 16">
                                    <path d="M2 1.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-1v1a4.5 4.5 0 0 1-2.557 4.06c-.29.139-.443.377-.443.59v.7c0 .213.154.451.443.59A4.5 4.5 0 0 1 12.5 13v1h1a.5.5 0 0 1 0 1h-11a.5.5 0 1 1 0-1h1v-1a4.5 4.5 0 0 1 2.557-4.06c.29-.139.443-.377.443-.59v-.7c0-.213-.154-.451-.443-.59A4.5 4.5 0 0 1 3.5 3V2h-1a.5.5 0 0 1-.5-.5zm2.5.5v1a3.5 3.5 0 0 0 1.989 3.158c.533.256 1.011.791 1.011 1.491v.702c0 .7-.478 1.235-1.011 1.491A3.5 3.5 0 0 0 4.5 13v1h7v-1a3.5 3.5 0 0 0-1.989-3.158C8.978 9.586 8.5 9.052 8.5 8.351v-.702c0-.7.478-1.235 1.011-1.491A3.5 3.5 0 0 0 11.5 3V2h-7z"/>
                                </svg>
                                <span className="d-none d-lg-inline">History</span>
                            </CustomLink>
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