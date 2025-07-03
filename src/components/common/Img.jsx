import React, { useState } from 'react'

const Img = ({src, alt, className}) => {
    const backendDomain = import.meta.env.VITE_BACKEND_DOMAIN;
    const [imgLaoding, setImgLaoding] = useState(true);
    return (
        <div className={`${className} relative`}> 
            {imgLaoding && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="w-6 h-6 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
            <img className={imgLaoding ? 'hidden' : ''} src={`${backendDomain}${src}`} alt={alt || ''} onLoad={() => setImgLaoding(false)}/>
        </div>
    )
}

export default Img
