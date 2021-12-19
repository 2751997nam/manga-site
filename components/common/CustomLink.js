/* eslint-disable react/display-name */
import Link from 'next/link';
import React from 'react';

function CustomLink (props) {
    const CustomLink = React.forwardRef(({ onClick, href, manga, className }, ref) => {
        return (
            <a href={href ? href : ''} onClick={onClick} ref={ref} className={className}>
                {props.children}
            </a>
        )
    });
    return (
        <Link href={props.href ? props.href : ''} alt={props.alt} title={props.title} passHref>
            <CustomLink className={props.className} />
        </Link>
    )
}

export default CustomLink;