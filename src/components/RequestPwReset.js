import React, { useState, useCallback } from "react";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import * as defComponents from "./defaultComponents";
import * as defLanguages from "../lang";

const useRequestPwReset = ({
  components: { InputField, SubmitButton, ErrorMessage } = defComponents,
  strings: languages = defLanguages,
  api: { post },
}) => {
  const RequestPwReset = ({
    containerStlye,
    onRequestPwReset = () => {},
    apiVersion,
    user,
    defaulLang = "en",
  }) => {
    const strings = languages[user.lang || defaulLang];

    const [loading, setLoading] = useState(false);
    const [emailUnknown, setEmailUnknown] = useState(false);

    const onSubmit = async ({ email }) => {
      if (email) {
        setEmailUnknown(false);
        setLoading(true);
        const req = post("user/$1/reset", [email])
          .auth(false.auth)
          .on(404, () => {
            setEmailUnknown(true);
          });
        if (apiVersion) {
          req.v(apiVersion);
        }
        try {
          await req;
          setLoading(false);
          onRequestPwReset();
        } catch (e) {
          if (e) {
            console.log(e);
          }
          setLoading(false);
        }
      }
    };

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
        <Form style={containerStlye}>
          <InputField label={strings.account.mail} name="email" type="email" />
          <div>
            <SubmitButton loading={loading}>
              {strings.pwForgotten.requestPwReset}
            </SubmitButton>
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
    containerStlye: PropTypes.object,
    apiVersion: PropTypes.number,
    onRequestPwReset: PropTypes.func,
    user: PropTypes.object,
    defaulLang: PropTypes.string,
  };

  return useCallback(connect(({ user }) => ({ user }), {})(RequestPwReset), [
    InputField,
    SubmitButton,
    ErrorMessage,
    post,
    languages,
  ]);
};

export default useRequestPwReset;
