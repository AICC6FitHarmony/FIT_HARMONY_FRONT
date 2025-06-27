// sliceTrainer.js 개선본
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// 서버로부터 트레이너와 체육관 정보 가져오기
export const fetchTrainers = createAsyncThunk(
  'trainer/fetchTrainers',
  async () => {
    const response = await fetch('http://localhost:8000/trainer');
    return response.json(); // { data: [...], gym: [...] } 형태를 기대
  }
);

const trainerSlice = createSlice({
  name: 'trainer',
  initialState: {
    trainers: {
      data: [], // 트레이너 정보 배열
      gym: [], // 체육관 정보 배열
      products: [], // 트레이너 정보 배열
    },
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrainers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTrainers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.trainers = action.payload; // payload: { data: [...], gym: [...] }
      })
      .addCase(fetchTrainers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default trainerSlice.reducer;
