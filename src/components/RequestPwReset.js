import React, { useState, useCallback } from "react";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import * as defLanguages from "../lang/index";

const useRequestPwReset = ({
  components,
  strings: languages = defLanguages,
  api: { post },
  apiPrefix: apiPrefix = "user",
}) => {
  const { FormikInput: InputField, Button, ErrorMessage } = components;

  const RequestPwReset = ({
    containerStyle,
    onRequestPasswordReset = () => {},
    apiVersion,
    defaulLang = "en",
  }) => {
    const userStore = useSelector(({ user }) => user);
    const strings = languages[userStore.language || defaulLang];

    const [loading, setLoading] = useState(false);
    const [emailUnknown, setEmailUnknown] = useState(false);
    const [requestDone, setRequestDone] = useState(false);

    const onSubmit = async ({ email }) => {
      if (email) {
        setEmailUnknown(false);
        setLoading(true);
        const req = post(apiPrefix + "/$1/reset", [email])
          .auth(false)
          .on(404, () => {
            setEmailUnknown(true);
          });
        if (apiVersion) {
          req.v(apiVersion);
        }
        try {
          await req;
          setLoading(false);
          setRequestDone(true);
          onRequestPasswordReset();
        } catch (e) {
          if (e) {
            console.log(e);
          }
          setLoading(false);
        }
      }
    };

    if (requestDone) {
      return (
        <div>
          <div>{strings.pwForgotten.done}</div>
        </div>
      );
    }

    return (
      <Formik
        initialValues={{ email: "" }}
        validationSchema={Yup.object({
          email: Yup.string()
            .email(strings.account.mailError)
            .required(strings.account.mailRequired),
        })}
        onSubmit={onSubmit}
      >
        <Form style={containerStyle}>
          <InputField label={strings.account.mail} name="email" type="email" />
          <div>
            <Button submit loading={loading}>
              {strings.pwForgotten.requestPwReset}
            </Button>
            {emailUnknown && (
              <ErrorMessage message={strings.pwForgotten.unknownEmail} />
            )}
          </div>
        </Form>
      </Formik>
    );
  };
  RequestPwReset.propTypes = {
    lang: PropTypes.string,
    containerStyle: PropTypes.object,
    apiVersion: PropTypes.number,
    onRequestPasswordReset: PropTypes.func,
    defaulLang: PropTypes.string,
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(RequestPwReset, [
    post,
    languages,
    apiPrefix,
    components,
    languages,
    post,
  ]);
};

export default useRequestPwReset;
