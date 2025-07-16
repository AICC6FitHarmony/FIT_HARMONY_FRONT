import React, { useState } from 'react'

const Img = ({src, alt, className}) => {
    const backendDomain = import.meta.env.VITE_BACKEND_DOMAIN;
    const [imgLaoding, setImgLaoding] = useState(true);


    const handleImageError = (e) => {
        const target = e.target;
        if (target.tagName === 'IMG' && !target.getAttribute('data-has-fallback')) {
          target.src="data:image/svg+xml;utf8,%3Csvg%20width%3D%22300%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%20%20%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23f5f5f5%22%3E%3C%2Frect%3E%0A%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2255%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20font-size%3D%2216%22%20fill%3D%22%23aaa%22%3E%0A%20%20%20%20%F0%9F%93%B7%20%EC%9D%B4%EB%AF%B8%EC%A7%80%20%EC%97%86%EC%9D%8C%0A%20%20%3C%2Ftext%3E%0A%3C%2Fsvg%3E%0A"; // 👈 2번 이미지 경로
          target.setAttribute('data-has-fallback', 'true');
        }
      }; 


    return (
        <div className={`relative w-full h-full`}> 
            {imgLaoding && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="w-6 h-6 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
            <img className={imgLaoding ? 'hidden' : `w-full h-full ${className}`} src={`${backendDomain}${src}`} alt={alt || ''} onLoad={() => setImgLaoding(false)}
            onError={handleImageError}/>
        </div>
    )
}

export default Img
