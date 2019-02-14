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
        text1: 'Someone already registered using this email'
          + ' address. Please register using another email address. If'
          + ' you have forgotten your password you can reset it ',
        link: 'here',
        text2: '.'
      },
      mailInvalid: {
        title: 'Email wrong',
        text: 'Your email address appears to be invalid. Please check it'
          + ' and try again.'
      }
    },
    login: {
      h1: '1. Login',
      signup: 'Create Account',
      authWrong: {
        title: 'Wrong Login',
        text: 'Your username or password is not correct.'
      },
      pwForgotten: 'Password forgotten?'
    },
    pwForgotten: {
      h1: 'Password forgotten',
      done: 'Don\'t worry, we have send you an email to the specified address.'
        + ' Please follow the instructions in the email to set a new password.'
    },
    resetPw: {
      h1: 'Reset your Password',
      noToken: 'There must have happened some kind of error: This is not a'
        + ' proper password reset link. Please check again or contact customer'
        + ' support.',
      instructions: 'Please enter a new password:',
      done: 'Your password was reset successfully! You can login with your new'
        + ' password now.'
    }
  }
};

export const de = {
  "apparts-login": {
    account: {
      mail: 'Email',
      mailError: 'Muss eine echte Email-Adresse sein',
      name: 'Name',
      nameError: `Ihr Nutzername muss mindestens ${LoginConf.nameLengthMin} Zeichen lang sein`,
      password: 'Password',
      passwordError: `Ihr Passwort muss mindestens ${LoginConf.pwLengthMin}`
        + ' Zeichen lang sein und mindestens eine Nummer und ein Sonderzeichen enthalten'
    },
    controlls: {
      continue: 'Weiter',
      cancel: 'Abbrechen',
      retry: 'Wiederholen',
      save: 'Speichern',
      ok: 'Ok'
    },
    simpleLanguage: {
      or: 'oder'
    },
    signup: {
      login: 'Mit existierendem Account anmelden',
      h1: '1. Registrieren',
      userExists: {
        text1: 'Diese Email-Adresse wurde bereits bei uns registriert.'
          + ' Bitte benutzen Sie eine andere Adresse. Falls'
          + ' Sie ihr Passwort vergessen haben sollten können Sie es ',
        link: 'hier',
        text2: ' zurücksetzen.'
      },
      mailInvalid: {
        title: 'Email-Adresse ungültig',
        text: 'Ihre Email-Adresse scheint ungültig zu sein. Bitte überprüfen'
          + ' Sie, ob Sie sie richtig eingegeben haben.'
      }
    },
    login: {
      h1: '1. Einloggen',
      signup: 'Jetzt registrieren',
      authWrong: {
        title: 'Ungültige Zugangsdaten',
        text: 'Ihr Passwort oder ihr Nutzername war nicht korrekt.'
      },
      pwForgotten: 'Passwort vergessen?'
    },
    pwForgotten: {
      h1: 'Passwort vergessen',
      done: 'Keine Sorge, wir haben Ihnen eine Email gesendet. Bitte folgen Sie'
        + ' den Instruktionen in der Email um ein neues Passwort zu vergeben.'
    },
    resetPw: {
      h1: 'Passwort zurück setzen',
      noToken: 'Da ist etwas schiefgegangen... Der Link den Sie verwendet haben'
        + ' ist kein gültiger Link um ein Passwort zurückzusetzen. Bitte'
        + ' überprüfen Sie, ob Sie ihn richtig eingegeben haben oder'
        + ' kontaktieren Sie unseren den Kundenservice.',
      instructions: 'Bitte neues Passwort eingeben:',
      done: 'Ihr Passwort wurde erfolgreich geändert! Sie können sich mit ihrem'
        + ' neuen Passwort jetzt wieder anmelden.'
    }
  }
};
