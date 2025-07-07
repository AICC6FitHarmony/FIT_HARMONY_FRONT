import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// 서버로부터 트레이너 정보 가져오기
export const fetchTrainers = createAsyncThunk(
  'trainer/fetchTrainers',
  async ({ limit, offset }) => {
    const response = await fetch(
      `${
        import.meta.env.VITE_BACKEND_DOMAIN
      }/trainer?limit=${limit}&offset=${offset}`,
      { credentials: 'include' }
    );
    return response.json();
  }
);
//detail 페이지 트레이너 상세 프로필 전보 가져오기.
//
export const fetchTrainerDetail = createAsyncThunk(
  'trainer/fetchTrainerDetail', // > 액션타입 이름으로 사용됨 (redux toolkit 에서 type으로 정해줌)
  async (userId) => {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_DOMAIN}/trainer/${userId}`,
      {
        credentials: 'include', //쿠키포함
      }
    );
    return response.json(); //json 형태로 내보냄
  }
);

export const fetchTrainerProduct = createAsyncThunk(
  'trainer/fetchTrainerProduct',
  async (userId) => {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_DOMAIN}/trainer/${userId}/product`,
      {
        credentials: 'include',
      }
    );
    return response.json();
  }
);

export const fetchTrainerReview = createAsyncThunk(
  'trainer/fetchTrainerReview',
  async (userId) => {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_DOMAIN}/trainer/${userId}/review`,
      {
        credentials: 'include',
      }
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
      detail: {},
      product: [],
      review: [],
    },
    status: 'idle', // status 초기 상태
    error: null,
  },
  extraReducers: (builder) => {
    builder //pending, fulfilled, rejected 상태 처리
      // pending: 비동기 작업 시작 됐을 때 발생
      // fullfiled: 작업 완료 되면 발생
      // rejected: 작업 실패 시 발생
      .addCase(fetchTrainers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTrainers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // 백엔드 응답: { success: true, data: [...], total: [{total: n}], message: '...' }
        state.trainers.data = action.payload.data;
        state.trainers.total = action.payload.total[0]?.total || 0;
      })
      .addCase(fetchTrainers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // 상세 조회 thunk 처리
      .addCase(fetchTrainerDetail.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTrainerDetail.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.trainers.detail = action.payload.data;
      })
      .addCase(fetchTrainerDetail.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchTrainerProduct.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTrainerProduct.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.trainers.product = action.payload.data;
      })
      .addCase(fetchTrainerReview.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTrainerReview.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.trainers.review = action.payload.data;
      });
  },
});

export default trainerSlice.reducer;
