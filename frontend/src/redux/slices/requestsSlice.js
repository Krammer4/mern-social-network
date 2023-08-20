import { createSlice } from "@reduxjs/toolkit";

const requestsSlice = createSlice({
  name: "requests",
  initialState: {
    requests: [],
  },
  reducers: {
    addRequest: (state, action) => {
      state.requests = action.payload;
    },
  },
});

export const requestReducer = requestsSlice.reducer;
export const { addRequest } = requestsSlice.actions;
