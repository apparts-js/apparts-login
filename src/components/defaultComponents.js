import React from "react";
import PropTypes from "prop-types";
import { Field, ErrorMessage as FErrorMessage } from "formik";

const ErrorMessage = ({ message }) => message && <div>{message}</div>;
ErrorMessage.propTypes = {
  message: PropTypes.string,
};

const InputField = ({ label, name, ...props }) => (
  <div>
    <label htmlFor={name}>{label}</label>
    <Field {...props} name={name} id={name} />
    <FErrorMessage
      name={name}
      render={(msg) => <ErrorMessage message={msg} />}
    />
  </div>
);
InputField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

const SubmitButton = ({ loading, disabled, ...props }) => {
  return <button type="submit" {...props} disabled={loading || disabled} />;
};
SubmitButton.propTypes = {
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
};

const Button = ({ loading, disabled, ...props }) => {
  return <button {...props} disabled={loading || disabled} />;
};
Button.propTypes = {
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
};

const Link = ({ children, to, ...props }) => (
  <a href={to} {...props}>
    {children}
  </a>
);
Link.propTypes = {
  children: PropTypes.node,
  to: PropTypes.string,
};

export { InputField, SubmitButton, Button, Link, ErrorMessage };
