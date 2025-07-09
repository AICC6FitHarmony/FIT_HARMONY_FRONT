import { createSlice } from '@reduxjs/toolkit';

const commonSlice = createSlice({
  name: 'loading',
  initialState: {
    isLoading: false,
    isMobile : (window.innerWidth < 768), // 모바일 화면인지 체크

    // 네비게이션 바 트레이너 유저 - 회원매칭/내정보 토글 버튼
    isTrainerMatchMember:false,
    trainerSelectedMember:{userId:0, userName:"회원선택"}
  },
  reducers: {
    showLoading: (state) => {
      state.isLoading = true;
    },
    hideLoading: (state) => {
      state.isLoading = false;
    },
    setIsTrainerMatchMember: (state, action) => {
        state.isTrainerMatchMember = action.payload;
    },
    setTrainerSelectedMember: (state, action) => {
      state.trainerSelectedMember = action.payload;
    }
  },
});

export const { showLoading, hideLoading, setIsTrainerMatchMember, setTrainerSelectedMember } = commonSlice.actions;
export default commonSlice.reducer;
