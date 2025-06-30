import { useDispatch } from 'react-redux';
import { hideLoading, showLoading } from "../redux/slice/loadingSlice";
import { useRef } from 'react';
import { toast } from 'react-toastify';

export function useRequest() {
    const dispatch = useDispatch();
    const requestCount = useRef(0); // 비동기 통신 요청 카운트

    return async function request(url, options = {}) {
        const defaultOptions = {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            charset: 'UTF-8',
          },
          ...options,
        };

        if(defaultOptions.body !== undefined) {
            defaultOptions.body = (typeof defaultOptions.body === 'object' ? JSON.stringify(defaultOptions.body) : defaultOptions.body);
        }

        if(defaultOptions.pathParam !== undefined) {
            defaultOptions.pathParam.forEach(param => {
                url += '/' + param;
            });
        }

        const backendDomain = import.meta.env.VITE_BACKEND_DOMAIN;
        if(url.startsWith('/')) {
            url = backendDomain + url;
        }

        // 다수 비동기 통신 처리 시 로딩 유지를 위해 현재 통신 카운팅
        if(requestCount.current == 0){
            dispatch(showLoading());
        }
        requestCount.current += 1;

        try {
            const response = await fetch(url, defaultOptions);

            if(!response.ok){
                // 응답 코드별 토스트 메세지
                switch (response.status) {
                  case 400:
                    toast.warn('잘못된 요청입니다.', {
                      position: "bottom-center"
                    });
                    break;
                  case 401:
                    toast.error("로그인 후 이용 가능한 서비스 입니다.\n잠시후 로그인 페이지로 이동합니다.", {
                      position: "bottom-center"
                    });

                    // 토스트 노출 이후 이동하도록 2초 후 동작
                    setTimeout(() => {
                      location.href = "/login";
                    }, 2000) 
                    break;
                  case 403:
                    toast.error('권한이 없습니다.', {
                      position: "bottom-center"
                    });
                    break;
                  case 404:
                    toast.warn('요청한 리소스를 찾을 수 없습니다.', {
                      position: "bottom-center"
                    });
                    break;
                  case 500:
                    toast.error('서버 내부 오류입니다.', {
                      position: "bottom-center"
                    });
                    break;
                  default:
                   toast.error(`에러 발생 (code: ${response.status})`, {
                      position: "bottom-center"
                    });
                    break;
                }
                return;
            }

            const data = await response.json();

            if (defaultOptions.callback !== undefined) {
              defaultOptions.callback(data);
            }

            return data;
        } catch (err) {
            console.error('API 요청 실패:', err);
            throw err;
        } finally {
            // 다수 비동기 통신 처리 시 로딩 유지
            requestCount.current --;
            if (requestCount.current === 0) {
              dispatch(hideLoading());
            }
        }
    };
}