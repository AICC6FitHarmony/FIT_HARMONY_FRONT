import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// API URL 설정
const DOMAIN = import.meta.env.VITE_BACKEND_DOMAIN;
const GET_MYPAGE_API_URL = `${DOMAIN}/mypage`;

// API 요청 함수들
const getRequest = async (url) => {
  console.log("url : ", url);
  return await fetch(url, {
    credentials: 'include',
  }).then((response) => {
    if (!response.ok) {
      throw new Error('Slice MyPage => Network response was not ok');
    }
    return response.json();
  });
};

// Inbody 일일 데이터 가져오기 Thunk
export const fetchUserData = createAsyncThunk(
  'mypage/fetchUserData',
  async ({ userId }) => {
    const fullPath = `${GET_MYPAGE_API_URL}/${userId}`;
    const response = await getRequest(fullPath);
    return response;
  }
);
