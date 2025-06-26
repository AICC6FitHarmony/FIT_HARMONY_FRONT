import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';



const loginCheck = (checkAction)=>{
  fetch(import.meta.env.VITE_BACKEND_DOMAIN+"/check-auth", {
    credentials: "include", // 세션 쿠키 포함
  })
    .then(res => res.json())
    .then(data => {
      if (data.isLoggedIn) {
        // 로그인 상태
        checkAction(data.user);
      } else {
        // 비로그인 상태
        checkAction(null);
      }
  });
}


const handleFulFilled = (stateKey)=>{
  return (state, action)=>{
    state[stateKey] = action.payload;
  }
}

const handleRejected = (state, action)=>{
  console.log("error",action);
}

const apiSlice = createSlice({
  name: 'user',
  initialState: {
    isLogin: null,
  },
  extraReducers: (builder)=>{
    builder
      .addCase(fetchGetItems.fulfilled, handleFulFilled("getItemsData"))
      .addCase(fetchGetItems.rejected, handleRejected)
  }
});

export default apiSlice.reducer;