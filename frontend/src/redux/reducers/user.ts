import { createAction, createSlice } from "@reduxjs/toolkit";
import { User } from "../../types/User";
import { Nullable } from "../../types/Other";

const userLogout = createAction("user/logout");

const initialState: Nullable<User> = null;

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(_, { payload: user }) {
      return user;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(userLogout, () => null);
  },
});

export default userSlice;
export const { setUser } = userSlice.actions;

export { userLogout };
