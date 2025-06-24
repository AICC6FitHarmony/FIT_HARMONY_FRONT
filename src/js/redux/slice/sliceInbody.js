import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// API URL 설정
const DOMAIN = 'http://localhost:8000';
const GET_INBODY_API_URL = `${DOMAIN}/inbody/user`;

// API 요청 함수들
const getRequest = async (url) => {
  return await fetch(url).then((response) => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  });
};

// Inbody 데이터 가져오기 Thunk
export const fetchInbodyData = createAsyncThunk(
  'inbody/fetchInbodyData',
  async (userId) => {
    const fullPath = `${GET_INBODY_API_URL}/${userId}`;
    console.log('API 호출 URL:', fullPath);
    const response = await getRequest(fullPath);
    console.log('API 응답 데이터:', response);
    return response;
  }
);

const inbodySlice = createSlice({
  name: 'inbody',
  initialState: {
    inbodyData: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearInbodyData: (state) => {
      state.inbodyData = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInbodyData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInbodyData.fulfilled, (state, action) => {
        state.loading = false;
        state.inbodyData = action.payload;
        console.log('Redux 스토어에 저장된 데이터:', action.payload);
      })
      .addCase(fetchInbodyData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        console.error('API 호출 실패:', action.error.message);
      });
  },
});

export const { clearInbodyData } = inbodySlice.actions;
export default inbodySlice.reducer; 