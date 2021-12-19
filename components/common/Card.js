const Card = (props) => {
    return (
        <div className="card">
            <div className="card-header">
                <h3 className="card-title font-title">
                    <i className="far fa-newspaper"></i> &nbsp;
                    {props.title}
                </h3>
            </div>
            <div className="card-body">{props.children}</div>
        </div>
    );
}

export default Card;