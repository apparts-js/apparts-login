import React, { useState, useEffect, useCallback } from "react";
import * as Yup from "yup";
import { login, logout } from "../redux/user";
import { Formik, Form } from "formik";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import * as defComponents from "./defaultComponents";
import * as defLanguages from "../lang";

const useLogin = ({
  components: { InputField, SubmitButton, Link, ErrorMessage } = defComponents,
  strings: languages = defLanguages,
  api: { get },
}) => {
  const Login = ({
    containerStlye,
    onLogin = () => {},
    onLogout = () => {},
    login,
    logout,
    logMeOut,
    apiVersion,
    user,
    pwForgottenUrl = "/passwordreset",
    defaulLang = "en",
  }) => {
    const strings = languages[user.lang || defaulLang];

    const [loading, setLoading] = useState(false);
    const [wrong, setWrong] = useState(false);

    useEffect(() => {
      if (user.id) {
        onLogin(user);
      }
    }, [user]);

    useEffect(() => {
      if (logMeOut) {
        logout();
        onLogout();
      }
    }, [logout, logMeOut]);

    const onSubmit = async ({ email, password }) => {
      if (email && password) {
        setWrong(false);
        setLoading(true);
        const req = get("login")
          .authPW(email, password)
          .on(400, () => {})
          .on(401, () => {});
        if (apiVersion) {
          req.v(apiVersion);
        }
        try {
          const me = await req;
          setLoading(false);
          login({ email, ...me });
        } catch (e) {
          if (e) {
            alert(e);
          }
          setWrong(true);
          setLoading(false);
        }
      } else {
        setWrong(true);
      }
    };

    return (
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={Yup.object({
          email: Yup.string()
            .email(strings.account.mailError)
            .required(strings.account.mailRequired),
          password: Yup.string().required(strings.account.passwordRequired),
        })}
        onSubmit={onSubmit}
      >
        <Form style={containerStlye}>
          <InputField label={strings.account.mail} name="email" type="email" />
          <InputField
            label={strings.account.password}
            name="password"
            type="password"
          />
          <div>
            <SubmitButton loading={loading}>{strings.login.login}</SubmitButton>
            {wrong && <ErrorMessage message={strings.login.authWrong} />}
          </div>
          <div>
            <Link to={pwForgottenUrl}>{strings.login.pwForgotten}</Link>
          </div>
        </Form>
      </Formik>
    );
  };
  Login.propTypes = {
    lang: PropTypes.string,
    containerStlye: PropTypes.object,
    apiVersion: PropTypes.number,
    onLogin: PropTypes.func,
    onLogout: PropTypes.func,
    login: PropTypes.func,
    logout: PropTypes.func,
    logMeOut: PropTypes.bool,
    user: PropTypes.object,
    pwForgottenUrl: PropTypes.string,
    defaulLang: PropTypes.string,
  };

  return useCallback(
    connect(({ user }) => ({ user }), { login, logout })(Login),
    [InputField, SubmitButton, Link, ErrorMessage, get, languages]
  );
};

export default useLogin;
