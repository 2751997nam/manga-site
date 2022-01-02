import { useState } from "react";
import TopViewItem from "./TopViewItem";

const TopView = (props)  => {
    const topViewsDay = props.topViewsDay;
    const topViewsMonth = props.topViewsMonth;
    const topViewsAll = props.topViewsAll;

    const [active, setActive] = useState(1);

    const renderItems = (mangas) => {
        return mangas.map(item => {
            return <TopViewItem key={item.id} manga={item}></TopViewItem>
        })
    }

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
                            {renderItems(topViewsDay)}
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
            </div>
        </div>
    )
}

export default TopView;