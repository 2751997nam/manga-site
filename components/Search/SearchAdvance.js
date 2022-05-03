import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import CustomLink from '@/components/common/CustomLink';

const SearchAdvance = (props) => {
    const [categories, setCategories] = useState({});
    const router = useRouter();
    const [filter, setFilter] = useState({
        q: router.query.q ?? '', 
        status: router.query.status ?? ''
    });

    const getCategories = useCallback(async () => {
        const response = await fetch(`/api/category?page_size=-1&fields=id,name,slug&sorts=name`)
            .then(res => res.json())
        let categories = {};
        let genre = [];
        let ungenre = [];
        if (router.query.genre) {
            genre = router.query.genre.split(',');
        }
        if (router.query.ungenre) {
            ungenre = router.query.ungenre.split(',');
        }
        for (let item of response.result) {
            if (genre.length > 0 && genre.includes(item.id + '')) {
                item.status = 'include';
            }
            if (ungenre.length > 0 && ungenre.includes(item.id + '')) {
                item.status = 'exclude';
            }
            categories[item.id] = item;
        }
        setCategories(categories);
    }, [router.query, setCategories]);

    const getClassName = (item) => {
        return item.status == 'include' ? 'icon-checkbox' : (item.status == 'exclude') ? 'icon-cross' : 'icon-checkbox';
    };

    const onClickCategory = useCallback((item) => {
        switch (item.status) {
            case 'include': {
                item.status = 'exclude';
                break;
            }
            case 'exclude': {
                item.status = null;
                break;
            }
            default: {
                item.status = 'include';
                break;
            }
        }

        let newCategories = {...categories};
        newCategories[item.id] = item;
        setCategories(newCategories);
    }, [categories, setCategories])

    const renderCategories = useCallback(() => {
        return Object.values(categories).map(item => {
            return (
                <li key={item.id} className="item col-sm-4 col-xs-6 col-6 pointer" title={item.name} data-genres={item.id} onClick={() => onClickCategory(item)}>
                    <span className={item.status == 'include' ? 'icon-tick' : (item.status == 'exclude' ? 'icon-cross' : 'icon-checkbox')}></span>
                    {item.name}
                </li>
            )
        })
    }, [categories, onClickCategory])

    const onChangeValue = (value, field) => {
        let newFilter = {...filter};
        newFilter[field] = value;
        setFilter(newFilter)
    }

    const buildQuery = () => {
        let retVal = {};

        let genre = Object.values(categories).filter(item => item.status == 'include').map(item => item.id);
        retVal.genre = genre.join(',');
        let ungenre = Object.values(categories).filter(item => item.status == 'exclude').map(item => item.id);
        retVal.ungenre = ungenre.join(',');

        for (let key of Object.keys(filter)) {
            retVal[key] = filter[key];
        }

        return retVal;
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const query = buildQuery();
        router.push({ 
            pathname: '/manga', 
            query: query
        })
    }

    useEffect(() => {
        renderCategories()
    }, [categories, renderCategories]);

    useEffect(() => {
        getCategories();
    }, [router.asPath, getCategories]);

    return (
        <div id="hopNangCao">
            <div className="card">
                <div className="card-header">
                    <h3 className="text-center bold h2title">Search Advanced</h3>
                    <CustomLink className="btn btn-primary btn-sm float-right d-flex-align-cener" href="/manga">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-repeat mr-1" viewBox="0 0 16 16">
                            <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"/>
                            <path fillRule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"/>
                        </svg>
                        Reset
                    </CustomLink>
                </div>
                <div className="card-body">
                    <fieldset>
                        <p><span className="icon-tick"></span> Search in these genres</p>
                        <p><span className="icon-cross"></span> Exclude these genres</p>
                        <p><span className="icon-checkbox"></span> The manga may or may not belong to this genre</p>
                    </fieldset>
                    <form onSubmit={handleSubmit} className="form-horizontal" id="TimNangCao">
                        <label htmlFor="danhcho">Genre(s):</label>
                        <div id="chontheloai" className="webkit-md-col4 webkit-sm-col4 webkit-xs-col3">
                            <ul className="row">
                                {renderCategories()}
                            </ul>
                        </div>
                        <div className="form-group row">
                            <div className="col-md-3 mt-1">
                                <label htmlFor="TinhTrang">Status:</label>
                                <select id="TinhTrang" name="m_status" defaultValue={filter.status} className="form-control" onChange={() => onChangeValue(event.target.value, 'status')}>
                                    <option value="">Any</option>
                                    <option value="COMPLETED">Completed</option>
                                    <option value="ACTIVE">On going</option>
                                </select>
                            </div>
                            <div className="col-md-9 mt-1">
                                <label htmlFor="q">Name</label>
                                <input type="text" name="name" value={filter.q} onChange={() => onChangeValue(event.target.value, 'q')} placeholder="Name" className="form-control" />
                            </div>
                        </div>

                        <div className="form-group row">
                            <div className="col-md-12 text-center">
                                <button type="submit" className="btn btn-warning d-flex-align-cener">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search mr-1" viewBox="0 0 16 16">
                                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                                    </svg>
                                    Search
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default SearchAdvance;