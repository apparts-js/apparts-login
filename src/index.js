import React from "react";
import ReactDOM from "react-dom";
import useLogin from "./components/Login";
import { withStore } from "./redux/testStore";
import * as api from "./testApi";

const MyLogin = () => {
  const Login = useLogin({ api });
  return withStore(<Login />);
};

ReactDOM.render(
  <React.StrictMode>
    <MyLogin />
  </React.StrictMode>,
  document.getElementById("root")
);
