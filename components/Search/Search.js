import { Fragment, useState, useCallback, useEffect } from "react";
import {DebounceInput} from 'react-debounce-input';
import Image from 'next/image';
import CustomLink from "../common/CustomLink";
import { getImageSrc } from '../../lib/hepler';

const Search = (props) => {
    const [mangas, setMangas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [ref, setRef] = useState(null);
    const [refMobile, setRefMobile] = useState(null);

    const hideResult = () => {
        setTimeout(() => {
            setMangas([]);
            setShowForm(false);
            ref.value = '';
        }, 300);
    }

    const onSearching = (event) => {
        const value = event.target.value;
        if (value) {
            setLoading(true);
            let appUrl = process.env.APP_URL;
            fetch('/api/manga?pageSize=5&fields=id,name,slug,image&filters=name~' + value)
                .then(res => res.json())
                .then(res => {
                    if (res.result) {
                        setMangas(res.result);
                    }
                    setLoading(false);
                }).catch(error => {
                    setLoading(false);
                });
        } else {
            setMangas([]);
        }
    }

    const renderLoading = useCallback(() => {
        return (<Image src="/images/loading.gif" alt="loading" layout='fill'></Image>);
    }, []);

    const getMangaList = useCallback(() => {
        if (loading) {
            return renderLoading();
        }
        return mangas.map(item => {
            return (<div key={item.id}>
                <CustomLink className="item" href={'/manga/' + item.id}>
                    <div className="media">
                        <Image className="img-size-50 mx-2" src={getImageSrc(item.image)} alt={item.name} width={50} height={60}></Image>
                        <div className="media-body">
                            <h6 className="my-0">{item.name}</h6>
                        </div>
                    </div>
                </CustomLink>
                <div className="dropdown-divider"></div>
            </div>)
        })
    }, [mangas, renderLoading, loading]);

    const renderMangas = useCallback(() => {
        return getMangaList();
    }, [getMangaList]);

    const renderMangasMobile = useCallback(() => {
        return getMangaList();
    }, [getMangaList]);

    useEffect(() => {
        if (!showForm) {
            renderMangas();
        } else {
            renderMangasMobile();
        }
    }, [mangas, showForm, loading, renderMangas, renderMangasMobile])

    return (
        <Fragment>
            <form tabIndex={0} onBlur={hideResult} className="form-inline ml-3 d-none d-md-inline align-self-center position-relative">
                <div className="input-group input-group-sm">
                    <DebounceInput
                        className="form-control form-control-navbar search-web inputSearch"
                        placeholder="Search" 
                        aria-label="Search" 
                        inputRef={setRef}
                        minLength={2}
                        debounceTimeout={300}
                        onChange={onSearching} 
                    />

                    <div className="input-group-append">
                        <button className="btn btn-navbar" type="submit">
                        <i className="fas fa-search"></i>
                        </button>
                    </div>
                </div>
                <div className={'ssSearch card ' + (mangas.length ? 'd-block' : 'd-none')}>
                    <div className="card-header pl-3 py-2 header-search">
                        <h5 className="card-title">Result</h5>
                    </div>
                    <div className="card-body search-result px-1 py-2">
                        {renderMangas()}
                    </div>
                </div>
            </form>
            <li className="nav-item">
                <a onClick={() => setShowForm(true)} className="nav-link search-mobile" data-widget="navbar-search" role="button">
                    <i className="fas fa-search"></i>
                </a>
                <div className={'navbar-search-block ' + (showForm ? 'navbar-search-open' : '')}>
                    <form className="form-inline position-relative" tabIndex={0} onBlur={hideResult}>
                        <div className="input-group input-group-sm">
                            <DebounceInput
                                className="form-control form-control-navbar inputSearch"
                                placeholder="Search" 
                                aria-label="Search" 
                                inputRef={setRefMobile}
                                minLength={2}
                                debounceTimeout={300}
                                onChange={onSearching} 
                            />
                            <div className="input-group-append">
                                <button className="btn btn-navbar" type="button" onClick={(event) => event.preventDefault()}>
                                    <i className="fas fa-search"></i>
                                </button>
                                <button className="btn btn-navbar" type="button" data-widget="navbar-search" onClick={hideResult}>
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                        </div>
                        <div className={'ssSearch card ' + (mangas.length ? 'd-block' : 'd-none')}>
                            <div className="card-header pl-3 py-2 header-search">
                                <h5 className="card-title">Result</h5>
                            </div>
                            <div className="card-body search-result px-1 py-2">
                                {renderMangasMobile()}
                            </div>
                        </div>
                    </form>
                </div>
            </li>
        </Fragment>
    )
}

export default Search;