import { useEffect, useState } from "react";
import CustomLink from "./CustomLink";
import { useRouter } from "next/router";

const SortBox = (props) => {
    const [sort, setSort] = useState('created_at');
    const [type, setType] = useState('DESC');
    const [url, setUrl] = useState('');
    const [baseUrl, setBaseUrl] = useState('');
    const router = useRouter();

    const onNavigate = (sort = null, type = null) => {
        if (sort) {
            setSort(sort);
        }

        if (type) {
            setType(type);
        }
    }

    const buildUrl = (field = null, sortType = null) => {
        let params = url.indexOf('?') ? url.split('?')[1] : '';
        let result = new URLSearchParams(params);
        if (field) {
            result.set('sort_by', field);
        }

        if (sortType) {
            result.set('sort_type', sortType);
        }
        if (!result.get('sort_type')) {
            result.set('sort_type', type);
        }
        return decodeURIComponent(baseUrl + '?' + result.toString());
    }

    useEffect(() => {
        let baseUrl = router.asPath.split('?')[0];
        let params = router.asPath.indexOf('?') ? router.asPath.split('?')[1] : '';
        let url = new URLSearchParams(params);
        let sort = url.get('sort_by');
        if (sort) {
            setSort(sort);
        }
        let type = url.get('sort_type');
        if (type) {
            setType(type);
        }
        setUrl(router.asPath);
        setBaseUrl(baseUrl);
    }, [router.asPath]);

    return (
        <div className="col-md-8">
            <div className="btn-group asc pr-2 py-2">
                <CustomLink onClick={() => onNavigate('', 'ASC')} href={buildUrl('', 'ASC')} className={'btn btn-sm btn-info ' + (type == 'ASC' ? 'active' : '')}>
                    <i className="fas fa-sort-amount-up-alt"></i> ASC
                </CustomLink>
                <CustomLink onClick={() => onNavigate('', 'DESC')} href={buildUrl('', 'DESC')} className={'btn btn-sm btn-info ' + (type == 'DESC' ? 'active' : '')}>
                    <i className="fas fa-sort-amount-down"></i> DESC
                </CustomLink>
            </div>
            <div className="btn-group soft-by py-2">
                <button className="btn btn-sm btn-info" disabled="">Sorted by</button>
                <CustomLink onClick={() => onNavigate('name', '')} href={buildUrl('name')} className={'btn btn-sm btn-info ' + (sort == 'name' ? 'active' : '')}>
                    <i className="fas fa-sort-alpha-down"></i> A-Z
                </CustomLink>
                <CustomLink onClick={() => onNavigate('view', '')} href={buildUrl('view')} className={'btn btn-sm btn-info ' + (sort == 'view' ? 'active' : '')}>
                    <i className="fas fa-eye"></i> Most view
                </CustomLink>
                <CustomLink onClick={() => onNavigate('created_at', '')} href={buildUrl('created_at')} className={'btn btn-sm btn-info ' + (sort == 'created_at' ? 'active' : '')}>
                    <i className="fas fa-calendar-times"></i> Last updated
                </CustomLink>
            </div>

            <div className="btn-group float-md-right py-2">
                <div className="button-group">
                    <CustomLink href="/search" type="button" className="btn btn-sm btn-primary float-right"><i className="fas fa-filter"></i> Search Adcenced</CustomLink>
                </div>
            </div>
        </div>
    )
}

export default SortBox;