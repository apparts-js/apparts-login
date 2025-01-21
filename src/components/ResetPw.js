import React, { useState, useCallback } from "react";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import { login } from "../redux/user/index";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import * as defLanguages from "../lang/index";

const useResetPassword = ({
  components: { FormikInput: InputField, Button, ErrorMessage },
  strings: languages = defLanguages,
  api: { put },
  apiPrefix: apiPrefix = "user",
}) => {
  const ResetPassword = ({
    containerStyle,
    onResetPassword = () => {},
    validatePassword = (pw) => !pw || pw.length >= 6,
    email,
    token,
    onDone,
    apiVersion,
    defaulLang = "en",
    welcome,
  }) => {
    const userStore = useSelector(({ user }) => user);
    const dispatch = useDispatch();
    const strings = languages[userStore.language || defaulLang];
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
        const req = put(apiPrefix)
          .authPW(email, token)
          .data({ password })
          .on({ status: 401, error: "User not found" }, () => {
            setTokenWrong(true);
          })
          .on({ status: 401, error: "Unauthorized" }, () => {
            setTokenWrong(true);
          });
        if (apiVersion) {
          req.v(apiVersion);
        }
        try {
          const me = await req;
          setLoading(false);
          setResetDone(true);
          dispatch(login({ email, ...me }));
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
        <Form style={containerStyle}>
          <div>{resetStrings.instructions}</div>
          <InputField
            label={strings.account.password}
            name="password"
            type="password"
          />
          <div>
            <Button submit loading={loading}>
              {resetStrings.resetPassword}
            </Button>
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
    containerStyle: PropTypes.object,
    apiVersion: PropTypes.number,
    onDone: PropTypes.func,
    onResetPassword: PropTypes.func,
    defaulLang: PropTypes.string,
    validatePassword: PropTypes.func,
    welcome: PropTypes.bool,
  };

  return useCallback(ResetPassword, [put, languages, apiPrefix]);
};

export default useResetPassword;
