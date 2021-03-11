import React from "react";
import configureStore from "@apparts/redux";
import { Provider } from "react-redux";

import user from "./user";

const { store, persistor } = configureStore({ user });

export default store;

const withStore = (app) => <Provider store={store}>{app}</Provider>;
export { persistor, withStore, store };
