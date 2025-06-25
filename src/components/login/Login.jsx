import React, { useState } from 'react';
import { request } from '../../js/config/requests';
import { Route, Routes } from 'react-router-dom';
import SignUpSelect from './SignUpSelect';
import LoginPage from './LoginPage';
import SignPerson from './SignPerson';

const Login = () => {





    return (
        <div className='my-10 mx-auto w-full flex justify-center'>
            <Routes>
                <Route path='/' element={<LoginPage loginFail={false}/>} />
                <Route path='/fail' element={<LoginPage loginFail={true}/>} />
                <Route path='/signup' element={<SignUpSelect/>} />
                <Route path='/signup/person' element={<SignPerson/>} />
            </Routes>
        </div>
    )
}

export default Login
