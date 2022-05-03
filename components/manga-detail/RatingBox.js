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
            <h4 className="d-flex-align-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-star-half mb-1" viewBox="0 0 16 16">
                    <path d="M5.354 5.119 7.538.792A.516.516 0 0 1 8 .5c.183 0 .366.097.465.292l2.184 4.327 4.898.696A.537.537 0 0 1 16 6.32a.548.548 0 0 1-.17.445l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256a.52.52 0 0 1-.146.05c-.342.06-.668-.254-.6-.642l.83-4.73L.173 6.765a.55.55 0 0 1-.172-.403.58.58 0 0 1 .085-.302.513.513 0 0 1 .37-.245l4.898-.696zM8 12.027a.5.5 0 0 1 .232.056l3.686 1.894-.694-3.957a.565.565 0 0 1 .162-.505l2.907-2.77-4.052-.576a.525.525 0 0 1-.393-.288L8.001 2.223 8 2.226v9.8z"/>
                </svg>
                <span>Rate.</span>
            </h4>
            <div className="h0rating" slug="theater-cociety-engsub">
                {renderRatingItems()}
            </div>
            {ratingCount > 0 && (<p className="text-center">{ratingCount} ratings</p>)}
        </div>
    )
}

export default RatingBox;