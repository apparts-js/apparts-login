import React, { useState, useCallback } from "react";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import * as defComponents from "./defaultComponents";
import * as defLanguages from "../lang";

const useSignup = ({
  components: { InputField, SubmitButton, Link, ErrorMessage } = defComponents,
  strings: languages = defLanguages,
  api: { post },
}) => {
  const Signup = ({
    containerStlye,
    onSignup = () => {},
    apiVersion,
    user,
    initialValues = {},
    validation = {},
    firstFields,
    lastFields,
    defaulLang = "en",
    transformBeforeSend = (a) => a,
  }) => {
    const strings = languages[user.lang || defaulLang];

    const [loading, setLoading] = useState(false);
    const [userExists, setUserExists] = useState(false);
    const [done, setDone] = useState(false);

    const validationSchema = Yup.object({
      email: Yup.string()
        .email(strings.account.mailError)
        .required(strings.account.mailRequired),
      ...validation,
    });

    const onSubmit = async (params) => {
      if (await validationSchema.isValid(params)) {
        setUserExists(false);
        setLoading(true);
        const req = post("user")
          .data(transformBeforeSend(params))
          .on({ status: 413, error: "User exists" }, () => {
            setUserExists(true);
          });
        if (apiVersion) {
          req.v(apiVersion);
        }
        try {
          await req;
          setLoading(false);
          onSignup(params);
          setDone(true);
        } catch (e) {
          if (e) {
            alert(e);
          }
          setLoading(false);
        }
      }
    };

    if (done) {
      return <div>{strings.signup.done}</div>;
    }

    return (
      <Formik
        initialValues={{ email: "", ...initialValues }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        <Form style={containerStlye}>
          {firstFields}
          <InputField label={strings.account.mail} name="email" type="email" />
          {lastFields}
          <div>
            <SubmitButton loading={loading}>
              {strings.signup.signup}
            </SubmitButton>
            {userExists && <ErrorMessage message={strings.signup.userExists} />}
          </div>
        </Form>
      </Formik>
    );
  };
  Signup.propTypes = {
    lang: PropTypes.string,
    containerStlye: PropTypes.object,
    apiVersion: PropTypes.number,
    onSignup: PropTypes.func,
    user: PropTypes.object,
    pwForgottenUrl: PropTypes.string,
    defaulLang: PropTypes.string,
    initialValues: PropTypes.object,
    validation: PropTypes.object,
    firstFields: PropTypes.array,
    lastFields: PropTypes.array,
    transformBeforeSend: PropTypes.func,
  };

  return useCallback(connect(({ user }) => ({ user }), {})(Signup), [
    InputField,
    SubmitButton,
    Link,
    ErrorMessage,
    post,
    languages,
  ]);
};

export default useSignup;
