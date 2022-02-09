/* eslint-disable react/display-name */
import Link from 'next/link';
import React from 'react';

function CustomLink (props) {
    const onClick = () => {
        if (props.onClick) {
            props.onClick();
        }
    }

    const CustomLink = React.forwardRef(({ onClick, href, className, title }, ref) => {
        return (
            <a href={href ? href : '/'} onClick={onClick} ref={ref} className={(className ? className : '') + ' custom-link'} title={title}>
                {props.children}
            </a>
        )
    });
    return (
        <Link href={props.href ? props.href : '/'} alt={props.alt} title={props.title} onClick={onClick} passHref>
            <CustomLink className={props.className} alt={props.alt} title={props.title} onClick={onClick} />
        </Link>
    )
    // return (
    //     <a href={props.href ? props.href : '/'} onClick={onClick} className={(props.className ? props.className : '') + ' custom-link'} title={props.title}>
    //         {props.children}
    //     </a>
    // )
}

export default CustomLink;