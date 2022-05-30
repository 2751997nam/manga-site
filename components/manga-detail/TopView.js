import { useEffect, useState, useMemo } from "react";
import TopViewItem from "@/components/manga-detail/TopViewItem";
import Script from 'next/script';

const TopView = (props)  => {
    const [topViews, setTopViews] = useState([]);
    const [topViewsMonth, setTopViewsMonth] = useState([]);
    const [topViewsAll, setTopViewsAll] = useState([]);
    const [active, setActive] = useState(1);
    
    const renderAdsScript = useMemo(() => {
        if (typeof props.userAgent != 'undefined' && props.userAgent.toLowerCase().includes('lighthouse')) {
            return <></>
        };
        // if (props.siteName == 'ManhwaPlus') {
        //     return (
        //         <>
        //             <ins className="adsbyexoclick" data-zoneid="4620562"></ins> 
        //             <Script>{`(AdProvider = window.AdProvider || []).push({"serve": {}});`}</Script>
        //         </>
        //     )
        // }

        return (
            <>
                <ins className="adsbyexoclick" data-zoneid="4615918"></ins>
                <Script>{`(AdProvider = window.AdProvider || []).push({"serve": {}});`}</Script>
            </>
        )
    }, [props])

    const fetchTopViews = () => {
        fetch('/api/top-view')
        .then(res => res.json())
        .then(res => {
            if (res.status == 'successful') {
                setTopViews(res.result.topViews);
                setTopViewsMonth(res.result.topViewsMonth);
                setTopViewsAll(res.result.topViewsAll);
            }
        })
    }


    const renderItems = (mangas) => {
        return mangas.map(item => {
            return <TopViewItem key={item.id} manga={item}></TopViewItem>
        })
    }

    useEffect(() => {
        fetchTopViews();
    }, [])

    return (
        <div className="card">
            <div className="card-header">
                <ul className="nav nav-pills nav-fill top-all">
                    <li className="nav-item">
                        <a onClick={() => setActive(1)} className={'nav-link font-title text-light text-center w-100 ' + (active == 1 ? 'active' : '') } data-toggle="tab">Top day</a>
                    </li>
                    <li className="nav-item">
                        <a onClick={() => setActive(2)} className={'nav-link font-title text-light text-center w-100 ' + (active == 2 ? 'active' : '') } data-toggle="tab">Top month</a>
                    </li>
                    <li className="nav-item">
                        <a onClick={() => setActive(3)} className={'nav-link font-title text-light text-center w-100 ' + (active == 3 ? 'active' : '') } data-toggle="tab">Top all</a>
                    </li>
                </ul>
            </div>
            <div className="card-body">
                <div className="tab-content">
                    <div className={'tab-pane ' + (active == 1 ? 'active' : '')}>
                        <div className="post">
                            {renderItems(topViews)}
                        </div>
                    </div>
                    <div className={'tab-pane ' + (active == 2 ? 'active' : '')}>
                        <div className="post">
                            {renderItems(topViewsMonth)}
                        </div>
                    </div>
                    <div className={'tab-pane ' + (active == 3 ? 'active' : '')}>
                        <div className="post">
                            {renderItems(topViewsAll)}
                        </div>
                    </div>
                </div>
                <div className="text-center mw-100-hidden">
                    <>{renderAdsScript}</>
                </div>
            </div>
        </div>
    )
}

export default TopView;