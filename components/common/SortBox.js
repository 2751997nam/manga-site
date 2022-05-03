import { useEffect, useState } from "react";
import CustomLink from "@/components/common/CustomLink";
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
        } else {
            setSort('created_at');
        }
        let type = url.get('sort_type');
        if (type) {
            setType(type);
        } else {
            setType('DESC');
        }
        setUrl(router.asPath);
        setBaseUrl(baseUrl);
    }, [router.asPath, router.query]);

    return (
        <div className="col-md-8">
            <div className="btn-group asc pr-2 py-2">
                <CustomLink onClick={() => onNavigate('', 'ASC')} href={buildUrl('', 'ASC')} className={'btn btn-sm btn-info ' + (type == 'ASC' ? 'active' : '')}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-sort-alpha-down" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M10.082 5.629 9.664 7H8.598l1.789-5.332h1.234L13.402 7h-1.12l-.419-1.371h-1.781zm1.57-.785L11 2.687h-.047l-.652 2.157h1.351z"/>
                        <path d="M12.96 14H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645V14zM4.5 2.5a.5.5 0 0 0-1 0v9.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L4.5 12.293V2.5z"/>
                    </svg> ASC
                </CustomLink>
                <CustomLink onClick={() => onNavigate('', 'DESC')} href={buildUrl('', 'DESC')} className={'btn btn-sm btn-info ' + (type == 'DESC' ? 'active' : '')}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-sort-alpha-up" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M10.082 5.629 9.664 7H8.598l1.789-5.332h1.234L13.402 7h-1.12l-.419-1.371h-1.781zm1.57-.785L11 2.687h-.047l-.652 2.157h1.351z"/>
                        <path d="M12.96 14H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645V14zm-8.46-.5a.5.5 0 0 1-1 0V3.707L2.354 4.854a.5.5 0 1 1-.708-.708l2-1.999.007-.007a.498.498 0 0 1 .7.006l2 2a.5.5 0 1 1-.707.708L4.5 3.707V13.5z"/>
                    </svg> DESC
                </CustomLink>
            </div>
            <div className="btn-group sort-by py-2">
                <button className="btn btn-sm btn-info" disabled="">Sorted by</button>
                <CustomLink onClick={() => onNavigate('name', '')} href={buildUrl('name')} className={'btn btn-sm btn-info ' + (sort == 'name' ? 'active' : '')}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-sort-alpha-down" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M10.082 5.629 9.664 7H8.598l1.789-5.332h1.234L13.402 7h-1.12l-.419-1.371h-1.781zm1.57-.785L11 2.687h-.047l-.652 2.157h1.351z"/>
                        <path d="M12.96 14H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645V14zM4.5 2.5a.5.5 0 0 0-1 0v9.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L4.5 12.293V2.5z"/>
                    </svg> A-Z
                </CustomLink>
                <CustomLink onClick={() => onNavigate('view', '')} href={buildUrl('view')} className={'btn btn-sm btn-info ' + (sort == 'view' ? 'active' : '')}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
                        <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                        <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                    </svg> Most view
                </CustomLink>
                <CustomLink onClick={() => onNavigate('created_at', '')} href={buildUrl('created_at')} className={'btn btn-sm btn-info ' + (sort == 'created_at' ? 'active' : '')}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="14" fill="currentColor" className="bi bi-calendar-check" viewBox="0 0 16 16">
                        <path d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
                        <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
                    </svg> Last updated
                </CustomLink>
            </div>

            <div className="btn-group float-md-right py-2">
                <div className="button-group">
                    <span onClick={props.toogleSearchAdvance} type="button" className="btn btn-sm btn-primary float-right">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-funnel" viewBox="0 0 16 16">
                            <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5v-2zm1 .5v1.308l4.372 4.858A.5.5 0 0 1 7 8.5v5.306l2-.666V8.5a.5.5 0 0 1 .128-.334L13.5 3.308V2h-11z"/>
                        </svg> Search Advanced
                    </span>
                </div>
            </div>
        </div>
    )
}

export default SortBox;