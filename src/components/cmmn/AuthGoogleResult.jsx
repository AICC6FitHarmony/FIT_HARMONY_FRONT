import React, { useEffect } from 'react'

const AuthGoogleResult = () => {
    useEffect(() => {
        // 컴포넌트가 마운트된 후 실행
        console.log(window.opener);
        if (window.opener) {
            window.opener.location.reload();
            window.close();
        }
    }, []);
    return (
        <></>
    )
}

export default AuthGoogleResult;