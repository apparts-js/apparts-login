import React from "react";
import { createRoot } from "react-dom/client";
import useLogin from "./components/Login";
import useSignup from "./components/Signup";
import useResetPw from "./components/ResetPw";
import useRequestPwReset from "./components/RequestPwReset";
import * as Yup from "yup";
import { FormikInput as InputField } from "@apparts/web-components";

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

const root = createRoot(document.getElementById("root"));

root.render(
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
        initialValues={{ before: "", after: "" }}
        validation={{
          before: Yup.number("Must be a number").integer("Must be Number"),
          after: Yup.string().required("This is missing"),
        }}
        firstFields={[<InputField key={1} name="before" label="First field" />]}
        lastFields={[<InputField key={2} name="after" label="Last field" />]}
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
  </React.StrictMode>
);
