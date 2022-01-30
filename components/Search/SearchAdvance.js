import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import CustomLink from '../common/CustomLink';

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
                    <CustomLink className="btn btn-primary btn-sm float-right" href="/manga"><i className="fas fa-sync"></i> Reset</CustomLink>
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
                                <button type="submit" className="btn btn-warning">
                                    <i className="fas fa-search" aria-hidden="true"></i> Search
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