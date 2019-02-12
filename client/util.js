const LoginConf = require('apparts-config').get('login');

export const checkMail = value =>
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);

export const checkPW = value =>
  value.length > LoginConf.pwLengthMin
  && /^(.*\d.*\D.*)|(.*\D.*\d.*)$/i.test(value);

export const checkPWLoose = value =>
  value.length > LoginConf.pwLengthMin;

export const checkName = value =>
  value.length > LoginConf.nameLengthMin;
