import React, { useState, useEffect, useCallback } from "react";
import * as Yup from "yup";
import { login, logout } from "../redux/user/index";
import { Formik, Form } from "formik";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import * as defLanguages from "../lang/index";

const useLogin = ({
  components,
  strings: languages = defLanguages,
  apiPrefix: apiPrefix = "user",
  api: { get },
}) => {
  const { FormikInput: InputField, Button, Link, ErrorMessage } = components;
  const Login = ({
    containerStyle,
    // eslint-disable-next-line no-unused-vars
    onLogin = (user) => {},
    onLogout = () => {},
    logMeOut,
    apiVersion,
    pwForgottenUrl = "/passwordreset",
    defaulLang = "en",
  }) => {
    const userStore = useSelector(({ user }) => user);
    const dispatch = useDispatch();
    const strings = languages[userStore.language || defaulLang];
    const user = userStore.user;

    const [loading, setLoading] = useState(false);
    const [wrong, setWrong] = useState(false);

    useEffect(() => {
      if (user?.id && !logMeOut) {
        onLogin(user);
      }
    }, [user, logMeOut, onLogin]);

    useEffect(() => {
      if (logMeOut) {
        dispatch(logout());
        onLogout();
      }
    }, [logMeOut, dispatch, onLogout]);

    const onSubmit = async ({ email, password }) => {
      if (email && password) {
        setWrong(false);
        setLoading(true);
        const req = get(apiPrefix + "/login")
          .settings({
            withCredentials: true,
          })
          .authPW(email, password)
          .on(425, () => {
            setWrong(strings.login.tooManyRequests);
          })
          .on(400, () => {
            setWrong(strings.login.authWrong);
          })
          .on(401, () => {
            setWrong(strings.login.authWrong);
          });
        if (apiVersion) {
          req.v(apiVersion);
        }
        try {
          const me = await req;
          setLoading(false);
          dispatch(login({ email, ...me }));
        } catch (e) {
          if (e) {
            alert(e);
          }
          setLoading(false);
        }
      } else {
        setWrong(strings.login.authWrong);
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
        <Form style={containerStyle} className="login">
          <InputField label={strings.account.mail} name="email" type="email" />
          <InputField
            label={strings.account.password}
            name="password"
            type="password"
          />
          <div className="submit">
            <Button submit loading={loading}>
              {strings.login.login}
            </Button>
            {wrong && <ErrorMessage message={wrong} />}
          </div>
          <div className="pwForgotten">
            <Link to={pwForgottenUrl}>{strings.login.pwForgotten}</Link>
          </div>
        </Form>
      </Formik>
    );
  };
  Login.propTypes = {
    lang: PropTypes.string,
    containerStyle: PropTypes.object,
    apiVersion: PropTypes.number,
    onLogin: PropTypes.func,
    onLogout: PropTypes.func,
    logMeOut: PropTypes.bool,
    user: PropTypes.object,
    pwForgottenUrl: PropTypes.string,
    defaulLang: PropTypes.string,
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(Login, [
    get,
    languages,
    apiPrefix,
    components,
    languages,
    get,
  ]);
};

export default useLogin;
