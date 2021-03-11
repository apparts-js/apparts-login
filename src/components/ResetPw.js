import React, { useState, useCallback } from "react";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import { login } from "../redux/user";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import * as defComponents from "./defaultComponents";
import * as defLanguages from "../lang";

const useResetPassword = ({
  components: {
    InputField,
    SubmitButton,
    Button,
    Link,
    ErrorMessage,
  } = defComponents,
  strings: languages = defLanguages,
  api: { put },
}) => {
  const ResetPassword = ({
    containerStlye,
    onResetPassword = () => {},
    validatePassword = (pw) => !pw || pw.length >= 6,
    email,
    token,
    onDone,
    login,
    apiVersion,
    user,
    defaulLang = "en",
    welcome,
  }) => {
    const strings = languages[user.lang || defaulLang];
    const resetStrings = welcome ? strings.setPw : strings.resetPw;

    const [loading, setLoading] = useState(false);
    const [tokenWrong, setTokenWrong] = useState(false);
    const [resetDone, setResetDone] = useState(false);

    const onSubmit = async ({ password }) => {
      if (!email || !token) {
        setTokenWrong(true);
        return;
      }
      if (password) {
        setTokenWrong(false);
        setLoading(true);
        const req = put("user")
          .authPW(email, token)
          .data({ password })
          .on({ status: 400, error: "Authorization wrong" }, () => {
            setTokenWrong(true);
          });
        if (apiVersion) {
          req.v(apiVersion);
        }
        try {
          const me = await req;
          setLoading(false);
          setResetDone(true);
          login({ email, ...me });
          onResetPassword(me);
        } catch (e) {
          if (e) {
            alert(e);
          }
          setLoading(false);
        }
      }
    };

    if (resetDone) {
      return (
        <div>
          <div>{resetStrings.done}</div>
          {onDone && <Button onClick={onDone}>{resetStrings.ok}</Button>}
        </div>
      );
    }

    return (
      <Formik
        initialValues={{ password: "" }}
        validationSchema={Yup.object({
          password: Yup.string()
            .test(
              "customPwCheck",
              strings.account.passwordError,
              validatePassword
            )
            .required(strings.account.passwordRequired),
        })}
        onSubmit={onSubmit}
      >
        <Form style={containerStlye}>
          <div>{resetStrings.instructions}</div>
          <InputField
            label={strings.account.password}
            name="password"
            type="password"
          />
          <div>
            <SubmitButton loading={loading}>
              {resetStrings.resetPassword}
            </SubmitButton>
            {tokenWrong && <ErrorMessage message={resetStrings.noToken} />}
          </div>
        </Form>
      </Formik>
    );
  };
  ResetPassword.propTypes = {
    email: PropTypes.string,
    token: PropTypes.string,
    lang: PropTypes.string,
    containerStlye: PropTypes.object,
    apiVersion: PropTypes.number,
    login: PropTypes.func,
    onDone: PropTypes.func,
    onResetPassword: PropTypes.func,
    user: PropTypes.object,
    defaulLang: PropTypes.string,
    validatePassword: PropTypes.func,
    welcome: PropTypes.bool,
  };

  return useCallback(
    connect(({ user }) => ({ user }), { login })(ResetPassword),
    [InputField, SubmitButton, Button, Link, ErrorMessage, put, languages]
  );
};

export default useResetPassword;
