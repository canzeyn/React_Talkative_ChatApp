import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    receiverId: "",
  },
  reducers: {

    setReceiverId: (state, action) => {
      state.receiverId = action.payload; //burada tıklanan kullanınıcn id değerini alıcağız
    }
  },

})

export const {  setReceiverId } = chatSlice.actions;

export default chatSlice.reducer;