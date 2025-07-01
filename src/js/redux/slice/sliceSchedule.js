import { createSlice } from '@reduxjs/toolkit';



const scheduleSlice = createSlice({
  name: 'schedule',
  initialState: {
    scheduleList: null,
  },
  reducers: {
    setScheduleList: (state, actions) => {
        state.scheduleList = actions.payload;
    },
  },
});

export const { setScheduleList } = scheduleSlice.actions;
export default scheduleSlice.reducer;