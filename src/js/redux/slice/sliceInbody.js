import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// API URL 설정
const DOMAIN = import.meta.env.VITE_BACKEND_DOMAIN;
const GET_INBODY_API_URL = `${DOMAIN}/inbody`;

// API 요청 함수들
const getRequest = async (url) => {
  console.log("url : ", url);
  return await fetch(url, {
    credentials: 'include',
  }).then((response) => {
    if (!response.ok) {
      throw new Error('Slice Inbody => Network response was not ok');
    }
    return response.json();
  });
};

// POST 요청 함수
const postRequest = async (url, data) => {
  console.log("POST url : ", url);
  console.log("POST data : ", data);
  return await fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then((response) => {
    if (!response.ok) {
      throw new Error('Slice Inbody => Network response was not ok');
    }
    return response.json();
  });
};

// PUT 요청 함수
const putRequest = async (url, data) => {
  console.log("PUT url : ", url);
  console.log("PUT data : ", data);
  return await fetch(url, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then((response) => {
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
  async ({ userId, startDate, endDate }) => {
    const fullPath = `${GET_INBODY_API_URL}/${userId}/month?startDate=${startDate}&endDate=${endDate}`;
    const response = await getRequest(fullPath);
    return response;
  }
);

// Inbody 데이터 등록 Thunk
export const insertInbodyData = createAsyncThunk(
  'inbody/insertInbodyData',
  async ({ userId, inbodyData }) => {
    const fullPath = `${GET_INBODY_API_URL}/${userId}`;
    const response = await postRequest(fullPath, inbodyData);
    return response;
  }
);

// Inbody 데이터 수정 Thunk
export const updateInbodyData = createAsyncThunk(
  'inbody/updateInbodyData',
  async ({inbodyData }) => {
    const fullPath = `${GET_INBODY_API_URL}/update`;
    const response = await putRequest(fullPath, inbodyData);
    return response;
  }
);

const inbodySlice = createSlice({
  name: 'inbody',
  initialState: {
    inbodyData: null,
    loading: false,
    error: null,
    insertSuccess: false,
    updateSuccess: false,
  },
  reducers: {
    clearInbodyData: (state) => {
      state.inbodyData = null;
      state.error = null;
    },
    clearInsertSuccess: (state) => {
      state.insertSuccess = false;
    },
    clearUpdateSuccess: (state) => {
      state.updateSuccess = false;
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
      })
      .addCase(insertInbodyData.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.insertSuccess = false;
      })
      .addCase(insertInbodyData.fulfilled, (state, action) => {
        state.loading = false;
        state.insertSuccess = true;
        console.log('인바디 데이터 등록 성공:', action.payload);
      })
      .addCase(insertInbodyData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.insertSuccess = false;
        console.error('인바디 데이터 등록 실패:', action.error.message);
      });
  },
});

export const { clearInbodyData, clearInsertSuccess, clearUpdateSuccess } = inbodySlice.actions;
export default inbodySlice.reducer; 