import { useState } from "react";
import CustomLink from "../common/CustomLink";

const Header = (props) => {
    const categories = props.categories;
    const [showDropdown, setShowDropDown] = useState(false);

    const toggleDropdown = () => {
        setShowDropDown(!showDropdown);
    }

    return (
        <nav id="sticky-navbar" className="main-header navbar navbar-expand navbar-dark navbar-primary">
            <div className="container">
                <CustomLink href="/" className="navbar-brand">
                    <img src="/uploads/logos/logo-mini.png" alt="Logo" className="brand-image elevation-3"  />
                    <span className="brand-text font-weight-light d-none d-lg-inline text-light">Manhwa</span>
                </CustomLink>
                <div className="navbar-collapse collapse">
                    <ul className="navbar-nav mr-auto">
                        <li className={'nav-item ' + (showDropdown ? 'show' : '')}>
                            <a data-toggle="dropdown" onClick={toggleDropdown} aria-expanded="true" className="nav-link dropdown-toggle"><i className="fas fa-book-open"></i><span className="d-none d-lg-inline ml-1">Genre(s)</span></a>
                            <div className={'dropdown-menu manga-mega-menu genres-menu w-100 justify-content-center ' + (showDropdown ? 'show' : '')}>
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
                            <CustomLink href="/manga-list.html?bookmark=1" className="nav-link"><i className="far fa-bookmark"></i> <span className="d-none d-lg-inline">Bookmark</span></CustomLink>
                        </li>
                        <li className="nav-item ml-1">
                            <CustomLink href="/manga-list.html?history=1" className="nav-link"><i className="fa fa-history" aria-hidden="true"></i> <span className="d-none d-lg-inline">History</span></CustomLink>
                        </li>
                        <li className="nav-item ml-1">
                            <CustomLink href="https://manhwa18.tv/" className="nav-link"><i className="fa fa-history" aria-hidden="true"></i> <span className="d-none d-lg-inline">Hentai</span></CustomLink>
                        </li>
                    </ul>
                </div>
                <ul className="navbar-nav ml-auto flex-row right-nav-wrapper">
                    <form className="form-inline ml-3 d-none d-md-inline align-self-center position-relative" action="/manga-list.html">
                        <div className="input-group input-group-sm">
                            <input className="form-control form-control-navbar search-web inputSearch" type="search" name="name" placeholder="Search" aria-label="Search" />
                            <div className="input-group-append">
                                <button className="btn btn-navbar" type="submit">
                                <i className="fas fa-search"></i>
                                </button>
                            </div>
                        </div>
                        <div className="ssSearch d-none card">
                            <div className="card-header pl-3 py-2 header-search">
                                <h5 className="card-title">Result</h5>
                            </div>
                            <div className="card-body search-result px-1 py-2">
                            </div>
                        </div>
                    </form>
                    <li className="nav-item">
                        <a className="nav-link search-mobile" data-widget="navbar-search" href="#" role="button">
                        <i className="fas fa-search"></i>
                        </a>
                        <div className="navbar-search-block">
                            <form className="form-inline position-relative" action="/manga-list.html">
                                <div className="input-group input-group-sm">
                                    <input className="form-control form-control-navbar inputSearch" type="search" placeholder="Search" name="name" aria-label="Search" />
                                    <div className="input-group-append">
                                        <button className="btn btn-navbar" type="submit">
                                        <i className="fas fa-search"></i>
                                        </button>
                                        <button className="btn btn-navbar" type="button" data-widget="navbar-search">
                                        <i className="fas fa-times"></i>
                                        </button>
                                    </div>
                                </div>
                                <div className="ssSearch d-none card">
                                    <div className="card-header pl-3 py-2 header-search">
                                        <h5 className="card-title">Result</h5>
                                    </div>
                                    <div className="card-body search-result px-1 py-2">
                                    </div>
                                </div>
                            </form>
                        </div>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/account/login"><i className="fas fa-sign-in-alt"></i> <span className="d-none d-sm-inline">Sign in</span></a>
                    </li>
                    <li className="nav-item d-none d-sm-inline">
                        <a className="nav-link" href="/account/register"><i className="fas fa-user-circle"></i> Register</a>
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default Header;