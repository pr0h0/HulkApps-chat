import { Reducer } from "react";
import { combineReducers } from "redux";

import userReducer from "./user";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const reducerObj: Record<string, Reducer<any, any>> = {};

[userReducer].forEach((reducer) => {
  reducerObj[reducer.name] = reducer.reducer;
});

const rootReducer = combineReducers(reducerObj);

export default rootReducer;
