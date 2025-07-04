// REDUX TOOLKIT
// combineReducers: 여러 리듀서를 하나로 합쳐주는 함수
// configureStore: 스토어를 생성하는 함수
import { configureStore } from '@reduxjs/toolkit';
import inbodyReducer from './slice/sliceInbody';
import trainerReducer from './slice/sliceTrainer';
import loadingReducer from './slice/loadingSlice';
import scheduleReducer from './slice/sliceSchedule';

// 리덕스 툴킷으로 스토어 생성
const store = configureStore({
  reducer: {
    inbody: inbodyReducer,
    trainer: trainerReducer,
    loading: loadingReducer,
    schedule: scheduleReducer
  },
});

export default store; // 다른데서 import해서 가져다 쓸라면 export 필수
