import "redux-thunk";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

const NAME = "user";
type User = { id: string; email: string; loginToken: string; apiToken: string };

export const renewApiToken = createAsyncThunk(
  `${NAME}/renewApiToken`,
  async (
    api: {
      get: (path: string) => {
        authPW(email: string, loginToken: string): Promise<string>;
      };
    },
    thunkApi
  ) => {
    const { user } = thunkApi.getState() as { user: User };
    const apiToken = await api
      .get("user/apiToken")
      .authPW(user.email, user.loginToken);
    thunkApi.dispatch(updateUser({ apiToken }));
    return;
  }
);

const initialState: {
  user: User | null;
  language?: string;
} = { user: null };

const userSlice = createSlice({
  name: NAME,
  initialState,
  reducers: {
    updateUser(state, action: PayloadAction<Partial<User>>) {
      const user = action.payload;
      state.user = { ...state.user, ...user } as User;
    },

    login(_, action: PayloadAction<User>) {
      return { user: action.payload };
    },
    logout() {
      return { user: null };
    },
    setLanguage(state, action: PayloadAction<string>) {
      state.language = action.payload;
    },
  },
});

const { actions, reducer } = userSlice;
export const { login, logout, setLanguage, updateUser } = actions;
export default reducer;

export const getUserDataFromApiToken = (user: { apiToken: string }) => {
  try {
    return JSON.parse(atob(user.apiToken.split(".")[1])) || {};
  } catch (e) {
    console.log("Error parsing apiToken", e);
    return {};
  }
};
