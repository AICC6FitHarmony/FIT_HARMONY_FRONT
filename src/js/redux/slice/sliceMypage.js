import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const DOMAIN = import.meta.env.VITE_BACKEND_DOMAIN;
const GET_MYPAGE_API_URL = `${DOMAIN}/mypage`;

const postRequest = async (url, data) => {
  return await fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then((response) => {
    if (!response.ok) {
      throw new Error('Slice Mypage => Network response was not ok');
    }
    return response.json();
  });
};


// 닉네임 중복 검사
export const checkNicknameDuplicate = createAsyncThunk(
  '/mypage/check-nickname',
  async ({ nickname }) => {
    const fullPath = `${GET_MYPAGE_API_URL}/check-nickname`;
    const response = await postRequest(fullPath, { nickname });
    return response;
  }
);

export const searchGym = createAsyncThunk(
  '/mypage/search-gym',
  async ({ search }) => {
    const fullPath = `${GET_MYPAGE_API_URL}/search-gym`;
    const response = await postRequest(fullPath, { search });
    return response;
  }
);

const mypageSlice = createSlice({
  name: 'mypage',
  initialState: {
    nicknameData: null,
    gymData: null,
    loading: false,
    error: null,
    isDuplicate: false,
  },
  reducers: {
    clearNicknameData: (state) => {
      state.nicknameData = null;
      state.error = null;
    },
    clearIsDuplicate: (state) => {
      state.isDuplicate = false;
    },
    clearGymData: (state) => {
      state.gymData = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkNicknameDuplicate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkNicknameDuplicate.fulfilled, (state, action) => {
        state.loading = false;
        state.nicknameData = action.payload;
      })
      .addCase(checkNicknameDuplicate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.isDuplicate = false;
        console.error('닉네임 중복 검사 실패:', action.error.message);
      })
      .addCase(searchGym.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchGym.fulfilled, (state, action) => {
        state.loading = false;
        state.gymData = action.payload;
      })
      .addCase(searchGym.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.gymData = null;
        console.error('운동 센터 검색 실패:', action.error.message);
      });
  },
});

export const { clearNicknameData, clearIsDuplicate, clearGymData } = mypageSlice.actions;
export default mypageSlice.reducer; 