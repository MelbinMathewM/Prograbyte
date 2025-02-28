import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

interface AuthState {
  accessToken: string | null;
  role: string | null;
}

const initialState: AuthState = {
  accessToken: Cookies.get("accessToken") || null,
  role: Cookies.get("role") || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserToken: (state, action: PayloadAction<{ accessToken: string | null; role: string | null }>) => {
      const { accessToken, role } = action.payload;

      state.accessToken = accessToken;
      state.role = role;

      if (accessToken) {
        Cookies.set("accessToken", accessToken, { expires: 7 });
      } else {
        Cookies.remove("accessToken");
      }

      if (role) {
        Cookies.set("role", role, { expires: 7 });
      } else {
        Cookies.remove("role");
      }
    },
    logout: (state) => {
      state.accessToken = null;
      state.role = null;
      Cookies.remove("accessToken");
      Cookies.remove("role");
    },
  },
});

export const { setUserToken, logout } = authSlice.actions;

export default authSlice.reducer;
