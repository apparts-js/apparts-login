import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";

import userStore from "./user";

const store = configureStore({ reducer: { user: userStore } });

export default store;

const withStore = (app) => <Provider store={store}>{app}</Provider>;
export { withStore, store };
