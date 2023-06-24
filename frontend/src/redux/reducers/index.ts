import { Reducer } from "react";
import { combineReducers } from "redux";

import userReducer from "./user";
import conversationsReducer from "./conversations";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const reducerObj: Record<string, Reducer<any, any>> = {};

[userReducer, conversationsReducer].forEach((reducer) => {
  reducerObj[reducer.name] = reducer.reducer;
});

const rootReducer = combineReducers(reducerObj);

export default rootReducer;
