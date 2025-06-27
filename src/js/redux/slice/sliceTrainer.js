import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const fetchTrainers = createAsyncThunk('trainer/fetchTrainers', async () => {
  const response = await fetch('http://localhost:8000/trainer');
  return response.json();
});

// Create the slice
const trainerSlice = createSlice({
  name: 'trainer', // Slicename
  initialState: {
    trainers: [], // Initialize as an empty array
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null, // To store error messages
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrainers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTrainers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.trainers = action.payload;
      })
      .addCase(fetchTrainers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export { fetchTrainers };
export default trainerSlice.reducer;
