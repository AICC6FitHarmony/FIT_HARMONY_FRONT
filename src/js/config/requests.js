export async function request(url, options) { // body는 데이터, callback은 콜백 함수, options는 ( 전체적으로 조정이 필요한 경우 )
    const defaultOptions = {
        method: 'POST', // default method
        credentials: 'include', // 세션 쿠키 포함
        headers: { // default header
            'Content-Type': 'application/json',
            'charset' : 'UTF-8'
        },
        ...options,
    }

    if(defaultOptions.body != undefined){ // body가 있으며, 객체인 경우 문자열로 변환
        defaultOptions.body = (typeof defaultOptions.body == 'object' ? JSON.stringify(defaultOptions.body) : options.body);
    }


    const backendDomain = import.meta.env.VITE_BACKEND_DOMAIN;
    if(!url.startWiths("/")){
        url = (backendDomain + url);
    }


    if(defaultOptions.pathParam != undefined){ // pathParam이 있는 경우
        defaultOptions.pathParam.forEach(param => {
            url += ("/"+param);
        });
    }

    return await fetch(url, defaultOptions).then((response) => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }else{
            return response.json();
        }
    }).then(data => {
        if(defaultOptions.callback != undefined){ 
            defaultOptions.callback(data);
            return data;
        }else{
            return data; // callback이 없으면 response.json() 데이터 반환
        }
    });
}
