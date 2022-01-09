import { useState } from 'react';
import Image from 'next/image';

const CustomImage = ({alt, ...props}) => {
    const [src, setSrc] = useState(props.src);
  
    return (
        <img
            {...props}
            src={src}
            alt={alt} // To fix lint warning 
            onError={() => setSrc(props.error_src)}
            placeholder="blur"
            blurDataURL="/images/loading.gif"
        />
    );
}

export default CustomImage;