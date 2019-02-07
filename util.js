

export const checkMail = value =>
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);

export const checkPW = value =>
  value.length > 4
  && /^(.*\d.*\D.*)|(.*\D.*\d.*)$/i.test(value);

export const checkPWLoose = value =>
  value.length > 4;
