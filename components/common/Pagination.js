import { Fragment, useEffect, useState } from "react";
import CustomLink from "./CustomLink";
import { useRouter } from "next/router";

const Pagination = (props) => {
    const router = useRouter();

    let [pageCount, setPageCount] = useState(props.meta.pageCount);
    let [pageId, setPageId] = useState(props.meta.pageId);
    let [pageSize, setPageSize] = useState(props.meta.pageSize);
    
    const query = props.query;
    const [url, setUrl] = useState('');

    const current = pageId + 1;

    const range = (min, max) => {
        let result = [];

        for (let i = min; i > 0 && i <= max; i++) {
            result.push(i);
        }

        return result;
    }

    const renderDot = () => {
        return (
            <li>
                <CustomLink href={void(0)} className="disabled">...</CustomLink>
            </li>
        )
    }

    useEffect(() => {
        let url = window.location.href;
        let index = url.indexOf('?');
        if (index > 0) {
            url = url.substr(0, index);
        }
        setUrl(url);
    }, [setUrl]);

    useEffect(() => {
        setPageCount(props.meta.pageCount);
        setPageId(props.meta.pageId);
        setPageSize(props.meta.pageSize);
    }, [router.asPath, props])

    const renderPages = (from, to) => {
        const pages = range(from, to);
        return (pages.map(value => {
            return (
                <li key={value}>
                    <CustomLink className={value == current ? 'active' : ''} href={getUrl(value)}>{value}</CustomLink>
                </li>
            );
        }))
    }

    const renderPage = (page, className = "") => {
        return (
            <li>
                <CustomLink className={className} href={getUrl(page)}>{page}</CustomLink>
            </li>
        )
    }

    const getUrl = (page) => {
        let params = Object.assign({}, query);
        params.page = page;

        let str = Object.keys(params).map(key => key + '=' + params[key]).join('&');

        return url + '?' + str;
    }

    const render = () => {
        if (pageCount <= 6) {
            return renderPages(1, pageCount);
        } else if (pageCount > 6 && pageId <= 3) {
            return (
                <>
                    {renderPages(1, 5)}
                    {renderDot()}
                    {renderPage(pageCount)}
                </>
            )
        } else if (pageCount > 6 && pageId > 3 && (pageCount - pageId > 5)) {
            return (
                <>
                    {renderPage(1)}
                    {renderDot()}
                    {renderPages(pageId - 1, pageId + 3)}
                    {renderDot()}
                    {renderPage(pageCount)}
                </>
            )
        } else if (pageCount > 6 && (pageCount - pageId <= 5)) {
            return (
                <>
                    {renderPage(1)}
                    {renderDot()}
                    {renderPages(pageCount - 5, pageCount)}
                </>
            )
        }
    }

    if (pageCount > 1) {
        return (
            <div className="pagination-wrap float-right">
                <ul className="pagination pagination-v4">
                    <li>
                        <CustomLink className={current == 1 ? 'disabled' : ''} href={getUrl(current - 1)}>«</CustomLink>
                    </li>
                    {render()}
                    <li>
                        <CustomLink className={current == pageCount ? 'disabled' : ''} href={getUrl(current + 1)}>»</CustomLink>
                    </li>
                </ul>
            </div>
        )
    } else {
        return <></>;
    }
}

export default Pagination;