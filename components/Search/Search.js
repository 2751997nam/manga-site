import { Fragment, useState, useCallback, useEffect } from "react";
import {DebounceInput} from 'react-debounce-input';
import Image from 'next/image';
import CustomLink from "@/components/common/CustomLink";
import { getImageSrc, getMangaRoute, getChapterRoute } from '@/lib/helper';
import { useRouter } from 'next/router';

const Search = (props) => {
    const [mangas, setMangas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [ref, setRef] = useState(null);
    const [refMobile, setRefMobile] = useState(null);
    const router = useRouter();
    const [query, setQuery] = useState({});

    const hideResult = useCallback(() => {
        setMangas([]);
        setShowForm(false);
        ref.value = '';
    }, [ref]);

    useEffect(() => {
        router.events.on('routeChangeStart', hideResult)

        return () => {
            router.events.off('routeChangeStart', hideResult)
        }
    }, [router.events, router.asPath, hideResult]);

    const onSearching = (event) => {
        const value = event.target.value;
        setQuery({...query, q: value});
        setMangas([]);
        if (value) {
            setLoading(true);
            let appUrl = process.env.APP_URL;
            fetch('/api/manga?page_size=5&fields=id,name,alt_name,slug,image&filters=name;alt_name=~' + value)
                .then(res => res.json())
                .then(res => {
                    if (res.result) {
                        setMangas(res.result);
                    }
                    setLoading(false);
                }).catch(error => {
                    setLoading(false);
                });
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
                <CustomLink className="item" href={getMangaRoute(item)}>
                    <div className="media">
                        <Image className="img-size-50 mx-2" src={getImageSrc(item.image)} alt={item.name} width={50} height={60}></Image>
                        <div className="media-body">
                            <h6 className="my-0">
                                {item.name}
                            </h6>
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

    const handleSubmit = (event) => {
        event.preventDefault();
        router.push({ 
            pathname: '/manga', 
            query: query
        })
    }

    const showMobileForm = () => {
        setShowForm(true);
        refMobile.focus();
    }

    useEffect(() => {
        setQuery({q: router.query.q});
    }, [router.asPath, router.query]);

    useEffect(() => {
        if (!showForm) {
            renderMangas();
        } else {
            renderMangasMobile();
        }
    }, [mangas, showForm, loading, renderMangas, renderMangasMobile])

    return (
        <Fragment>
            <form onSubmit={handleSubmit} tabIndex={0} className="form-inline ml-3 d-none d-md-inline align-self-center position-relative">
                <div className="input-group input-group-sm">
                    <DebounceInput
                        className="form-control form-control-navbar search-web inputSearch"
                        placeholder="Search" 
                        aria-label="Search" 
                        inputRef={setRef}
                        minLength={2}
                        name="q"
                        value={query.q}
                        autoComplete="off"
                        debounceTimeout={300}
                        onChange={onSearching} 
                    />

                    <div className="input-group-append">
                        <span className="btn btn-navbar" type="submit">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                            </svg>
                        </span>
                    </div>
                </div>
                <div className={'ssSearch card ' + (mangas.length ? 'd-block' : 'd-none')}>
                    <div className="card-header pl-3 py-2 header-search">
                        <h4 className="card-title">Result</h4>
                    </div>
                    <div className="card-body search-result px-1 py-2">
                        {renderMangas()}
                    </div>
                </div>
            </form>
            <li className="nav-item">
                <span onClick={showMobileForm} className="nav-link search-mobile" data-widget="navbar-search" role="button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                    </svg>
                </span>
                <div className={'navbar-search-block ' + (showForm ? 'navbar-search-open' : '')}>
                    <form onSubmit={handleSubmit} className="form-inline position-relative" tabIndex={0}>
                        <div className="input-group input-group-sm">
                            <DebounceInput
                                className="form-control form-control-navbar inputSearch"
                                placeholder="Search" 
                                aria-label="Search" 
                                inputRef={ref => setRefMobile(ref)}
                                minLength={2}
                                debounceTimeout={300}
                                onChange={onSearching} 
                                autoFocus
                            />
                            <div className="input-group-append">
                                <span className="btn btn-navbar" type="submit">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                                    </svg>
                                </span>
                                <span className="btn btn-navbar" type="button" data-widget="navbar-search" onClick={() => setShowForm(false)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle-fill " viewBox="0 0 16 16">
                                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
                                    </svg>
                                </span>
                            </div>
                        </div>
                        <div className={'ssSearch card ' + (mangas.length ? 'd-block' : 'd-none')}>
                            <div className="card-header pl-3 py-2 header-search">
                                <h4 className="card-title">Result</h4>
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