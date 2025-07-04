import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// 서버로부터 트레이너 정보 가져오기
export const fetchTrainers = createAsyncThunk(
  'trainer/fetchTrainers',
  async ({ limit, offset }) => {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_DOMAIN}/trainer?limit=${limit}&offset=${offset}`,
      { credentials: 'include' }
    );
    return response.json();
  }
);

const trainerSlice = createSlice({
  name: 'trainer',
  initialState: {
    // 초기상태 지정
    trainers: {
      data: [], // 트레이너 정보 배열 (gym, product 정보 포함)
      total: 0, // 총 트레이너 수
      detail: [],
    },
    status: 'idle', // status 초기 상태
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrainers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTrainers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // 백엔드 응답: { success: true, data: [...], total: [{total: n}], message: '...' }
        state.trainers.data = action.payload.data;
        state.trainers.total = action.payload.total[0]?.total || 0;
        state.trainers.detail = action.payload.detail;
      })
      .addCase(fetchTrainers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default trainerSlice.reducer;
