import { requestReducer } from "./slices/requestsSlice";

const { configureStore } = require(`@reduxjs/toolkit`);

export const store = configureStore({
  reducer: {
    requests: requestReducer,
  },
});
