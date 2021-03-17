import React from "react";
import ReactDOM from "react-dom";
import useLogin from "./components/Login";
import useSignup from "./components/Signup";
import useResetPw from "./components/ResetPw";
import useRequestPwReset from "./components/RequestPwReset";

import * as components from "@apparts/web-components";

import { withStore } from "./redux/testStore";
import * as api from "./testApi";
import "@apparts/web-components/style.css";

import PropTypes from "prop-types";

const Link = ({ to, children }) => <a href={to}>{children}</a>;
Link.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node,
};

const MyLogin = (props) => {
  const Login = useLogin({
    api,
    components: {
      ...components,
      Link,
    },
  });
  return withStore(<Login {...props} />);
};

const MySignup = (props) => {
  const Signup = useSignup({ api, components });
  return withStore(<Signup {...props} />);
};

const MyResetPw = (props) => {
  const ResetPw = useResetPw({ api, components });
  return withStore(<ResetPw components={components} {...props} />);
};

const MyRequestPwReset = (props) => {
  const RequestPwReset = useRequestPwReset({ api, components });
  return withStore(<RequestPwReset components={components} {...props} />);
};

ReactDOM.render(
  <React.StrictMode>
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <MySignup
        containerStyle={{
          width: "min(500px, calc(100% - 20px))",
          padding: 40,
          paddingTop: 120,
        }}
      />
    </div>{" "}
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <MyResetPw
        welcome
        containerStyle={{
          width: "min(500px, calc(100% - 20px))",
          padding: 40,
          paddingTop: 120,
        }}
      />
    </div>{" "}
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <MyRequestPwReset
        containerStyle={{
          width: "min(500px, calc(100% - 20px))",
          padding: 40,
          paddingTop: 120,
        }}
      />
    </div>
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <MyLogin
        containerStyle={{
          width: "min(500px, calc(100% - 20px))",
          padding: 40,
          paddingTop: 120,
        }}
      />
    </div>
  </React.StrictMode>,
  document.getElementById("root")
);
