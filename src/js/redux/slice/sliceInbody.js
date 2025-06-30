import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// API URL 설정
const DOMAIN = 'http://localhost:8000';
const GET_INBODY_API_URL = `${DOMAIN}/inbody`;

// API 요청 함수들
const getRequest = async (url) => {
  console.log("url : ", url);
  return await fetch(url).then((response) => {
    if (!response.ok) {
      throw new Error('Slice Inbody => Network response was not ok');
    }
    return response.json();
  });
};

// Inbody 일일 데이터 가져오기 Thunk
export const fetchInbodyDayData = createAsyncThunk(
  'inbody/fetchInbodyDayData',
  async ({ userId, inbodyTime }) => {
    const fullPath = `${GET_INBODY_API_URL}/${userId}?inbodyTime=${inbodyTime}`;
    //console.log('API 호출 URL:', fullPath);
    const response = await getRequest(fullPath);
    //console.log('API 응답 데이터:', response);
    return response;
  }
);

// Inbody 월간 데이터 가져오기 Thunk

export const fetchInbodyMonthData = createAsyncThunk(
  'inbody/fetchInbodyMonthData',
  async ({ userId, inbodyMonthTime }) => {
    const fullPath = `${GET_INBODY_API_URL}/${userId}/month?inbodyMonthTime=${inbodyMonthTime}`;
    const response = await getRequest(fullPath);
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
      .addCase(fetchInbodyDayData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInbodyDayData.fulfilled, (state, action) => {
        state.loading = false;
        state.inbodyData = action.payload;
        //console.log('Redux 스토어에 저장된 데이터:', action.payload);
      })
      .addCase(fetchInbodyDayData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        console.error('API 호출 실패:', action.error.message);
      })
      .addCase(fetchInbodyMonthData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInbodyMonthData.fulfilled, (state, action) => {
        state.loading = false;
        state.inbodyData = action.payload;
        //console.log('Redux 스토어에 저장된 데이터:', action.payload);
      })
      .addCase(fetchInbodyMonthData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        console.error('API 호출 실패:', action.error.message);
      });
  },
});

export const { clearInbodyData } = inbodySlice.actions;
export default inbodySlice.reducer; 