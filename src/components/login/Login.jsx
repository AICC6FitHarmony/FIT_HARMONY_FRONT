import React, { useEffect, useState } from 'react';
import { Link, redirect, Route, Routes } from 'react-router-dom';
import SignUpSelect from './SignUpSelect';
import LoginPage from './LoginPage';
import SignPerson from './SignPerson';
import { ToastContainer, toast } from 'react-toastify';
import { loginCheck } from '../../js/login/loginUtils';
import { useAuth } from '../../js/login/AuthContext';
import SignTrainer from './SignTrainer';

const Login = () => {
  const { user } = useAuth();
  console.log(user);

  if (user) {
    // location.href = "/";
  }

  return (
    <div className="py-10 mx-auto w-full flex justify-center">
      <Routes>
        <Route path="/" element={<LoginPage loginFail={false} />} />
        <Route path="/fail" element={<LoginPage loginFail={true} />} />
        <Route path="/signup" element={<SignUpSelect />} />
        <Route path="/signup/person" element={<SignPerson />} />
        {/* <Route path='/signup/trainer' element={<SignTrainer/>} /> */}
      </Routes>
    </div>
  );
};

export default Login;
