import { createSlice } from '@reduxjs/toolkit';

const commonSlice = createSlice({
  name: 'loading',
  initialState: {
    isLoading: false,
    isMobile : (window.innerWidth < 768) // 모바일 화면인지 체크
  },
  reducers: {
    showLoading: (state) => {
      state.isLoading = true;
    },
    hideLoading: (state) => {
      state.isLoading = false;
    },
  },
});

export const { showLoading, hideLoading } = commonSlice.actions;
export default commonSlice.reducer;
