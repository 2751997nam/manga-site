import { useState } from "react";

const RatingBox = (props) => {
    const [ratingCount, setRatingCount] = useState(props.ratingCount);
    const [ratingValue, setRatingValue] = useState(props.ratingValue);
    const [isRated, setIsRated] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [hoverIndex, setHoverIndex] = useState(-1);

    const onMouseOver = (index) => {
        if (!isRated) {
            setIsHovering(true);
            setHoverIndex(index);
        }
    }

    const getClassName = (index) => {
        if (isRated) {
            return 'h0_ratings_active ' + (hoverIndex >= index ? "h0_ratings_on" : "h0_ratings_off");
        }
        else if (isHovering) {
            return 'h0_ratings_active ' + (index <= hoverIndex ? "h0_ratings_on" : "h0_ratings_off");
        } else {
            return 'h0_ratings_active ' + (ratingCount > 0 && ratingValue > index ? "h0_ratings_on" : "h0_ratings_off");
        }
    }

    const onRating = (index) => {
        let value = ratingValue * ratingCount;
        let count = ratingCount + 1;
        value = (value + index + 1) / count;
        setRatingCount(count);
        setRatingValue(value);
        setIsRated(true);
        fetch('/api/rate', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: props.mangaId,
                rate: index + 1
            })
        })
    }

    const renderRatingItems = () => {
        let retVal = [];

        for (let i = 1; i <= 5; i++) {
            retVal.push((<span key={i} className={getClassName(i)} onMouseOver={() => onMouseOver(i)} onClick={() => onRating(i)}></span>))
        }

        return retVal;
    }

    return (
        <div className="pt-2 pl-lg-2">
            <h4><i className="fas fa-star-half-alt"></i> Rate.</h4>
            <div className="h0rating" slug="theater-cociety-engsub">
                {renderRatingItems()}
            </div>
            {ratingCount > 0 && (<p className="text-center">{ratingCount} ratings</p>)}
        </div>
    )
}

export default RatingBox;