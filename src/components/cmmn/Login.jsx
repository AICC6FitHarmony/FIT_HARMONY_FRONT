import React, { useState } from 'react';
import { request } from '../../js/utils/requests';
import { ToastContainer, toast } from 'react-toastify';

const Login = () => {

    const [ loginValues, setLoginValues ] = useState({id:'', password:''});
    const { id, password } = loginValues;
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setLoginValues(prev => ({
            ...prev,
            [name] : (type == 'checkbox' ? checked : value)
        }));
    } 


    const login = async () => {
            try {
                const options = {
                    method : 'post',
                    body: loginValues
                }
                const data = await request("/auth/login", options);
                console.log(data);

            } catch (err) {
                alert('로그인 실패')
            }
      }


      // 구글 로그인 (팝업)
    const googleLogin = () => {
        toast.info("구글 로그인으로 이동합니다.", {
            position: "bottom-center"
        });
        location.href = `${import.meta.env.VITE_BACKEND_DOMAIN}/auth/google`;
    }



    return (
        <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
            <h1> 로그인 시스템 (세션 기반)</h1>
                <div>
                <input placeholder="ID (이메일)" name="id" value={id} onChange={handleChange}/><br />
                <input type="password" placeholder="비밀번호" name="password" value={password} onChange={handleChange}/><br />
                <button onClick={login}>일반 로그인</button>
                </div>
    
                <hr />
    
                <div>
                <button onClick={googleLogin}>Google 로그인</button>
                </div>
                <ToastContainer/>
        </div>
    )
}

export default Login
