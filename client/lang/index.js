const LoginConf = require('apparts-config').get('login');

export const eng = {
  "apparts-login": {
    account: {
      mail: 'email',
      mailError: 'Must be a valid email address',
      name: 'name',
      nameError: `The name has to be at least ${LoginConf.nameLengthMin} characters long`,
      password: 'password',
      passwordError: `The password has to be at least ${LoginConf.pwLengthMin}`
        + ' characters long and must contain numbers and letters'
    },
    controlls: {
      continue: 'Continue',
      cancel: 'Cancel',
      retry: 'Retry',
      save: 'Save',
      ok: 'Ok'
    },
    simpleLanguage: {
      or: 'or'
    },
    signup: {
      login: 'Login with existing account',
      h1: '1. Signup',
      userExists: {
        text1: 'Someone already registerd using this email'
          + ' address. Please register using another email address. If'
          + ' you have forgotten your password you can reset it ',
        link: 'here',
        text2: '.'
      },
      mailInvalid: {
        title: 'Email wrong',
        text: 'Your email address apears to be invalid. Please check it'
          + ' and try again.'
      }
    },
    login: {
      h1: '1. Login',
      signup: 'Create Account',
      authWrong: {
        title: 'Wrong Login',
        text: 'Your username or password is not correct.'
      }
    }
  }
};
