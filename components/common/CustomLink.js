/* eslint-disable react/display-name */
import Link from 'next/link';
import React from 'react';

function CustomLink (props) {
    const CustomLink = React.forwardRef(({ onClick, href, className, title }, ref) => {
        return (
            <a href={href ? href : '/'} onClick={onClick} ref={ref} className={className} title={title}>
                {props.children}
            </a>
        )
    });
    return (
        <Link href={props.href ? props.href : '/'} alt={props.alt} title={props.title} onClick={props.onClick} passHref>
            <CustomLink className={props.className} alt={props.alt} title={props.title} onClick={props.onClick} />
        </Link>
    )
}

export default CustomLink;