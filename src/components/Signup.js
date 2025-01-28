import React, { useState, useCallback } from "react";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import * as defLanguages from "../lang/index";

const useSignup = ({
  components,
  strings: languages = defLanguages,
  apiPrefix: apiPrefix = "user",
  api: { post },
}) => {
  const { FormikInput: InputField, Button, ErrorMessage } = components;
  const Signup = ({
    containerStyle,
    onSignup = () => {},
    apiVersion,
    initialValues = {},
    validation = {},
    firstFields,
    lastFields,
    defaulLang = "en",
    transformBeforeSend = (a) => a,
  }) => {
    const user = useSelector(({ user }) => user);
    const strings = languages[user.language || defaulLang];

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
        const req = post(apiPrefix)
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
        <Form style={containerStyle}>
          {firstFields}
          <InputField label={strings.account.mail} name="email" type="email" />
          {lastFields}
          <div>
            <Button submit loading={loading}>
              {strings.signup.signup}
            </Button>
            {userExists && <ErrorMessage message={strings.signup.userExists} />}
          </div>
        </Form>
      </Formik>
    );
  };
  Signup.propTypes = {
    lang: PropTypes.string,
    containerStyle: PropTypes.object,
    apiVersion: PropTypes.number,
    onSignup: PropTypes.func,
    defaulLang: PropTypes.string,
    initialValues: PropTypes.object,
    validation: PropTypes.object,
    firstFields: PropTypes.array,
    lastFields: PropTypes.array,
    transformBeforeSend: PropTypes.func,
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(Signup, [
    post,
    languages,
    apiPrefix,
    components,
    languages,
    post,
  ]);
};

export default useSignup;
