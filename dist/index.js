Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var Yup = require('yup');
var formik = require('formik');
var reactRedux = require('react-redux');
var PropTypes = _interopDefault(require('prop-types'));

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var login = function login(user) {
  return {
    type: "USER_LOGIN",
    user: user
  };
};
var logout = function logout() {
  return {
    type: "USER_LOGOUT"
  };
};
var setLanguage = function setLanguage(lang) {
  return {
    type: "SET_LANGUAGE",
    lang: lang
  };
};

var reducer = function reducer(types) {
  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    switch (action.type) {
      case types.USER_LOGIN.name:
        return _objectSpread2({}, action.user);

      case types.USER_LOGOUT.name:
        return {};

      case types.SET_LANGUAGE.name:
        return _objectSpread2(_objectSpread2({}, state), {}, {
          lang: action.lang
        });

      default:
        return state;
    }
  };
};

var actionNames = [logout().type, login().type, setLanguage().type];
var user = {
  reducer: reducer,
  actionNames: actionNames,
  login: login,
  logout: logout
};

var index = /*#__PURE__*/Object.freeze({
  __proto__: null,
  login: login,
  logout: logout,
  setLanguage: setLanguage,
  'default': user
});

var en = {
  account: {
    mail: "Email",
    mailError: "Invalid email adress. Please check your input.",
    mailRequired: "Please enter your email adress.",
    password: "Password",
    passwordError: "Invalid password: The password must be at least six characters long. Please check your input.",
    passwordRequired: "Please enter your password."
  },
  signup: {
    userExists: "Someone already registered using this email" + " address. Please register using another email address. If" + " you have forgotten your password you can reset it on the login page.",
    signup: "Register",
    done: "We have send you an email to confirm your account. Please follow the instructions in the email to log in."
  },
  login: {
    login: "Log in",
    authWrong: "Your username or password is not correct. Please check your input.",
    pwForgotten: "Password forgotten"
  },
  pwForgotten: {
    requestPwReset: "Reset password",
    unknownEmail: "We could not find a user with the entered email adress. Please check your input.",
    done: "Don't worry, we have send you an email to the specified address." + " Please follow the instructions in the email to set a new password."
  },
  resetPw: {
    noToken: "There must have happened some kind of error: This is not a" + " proper password reset link. Please check again or contact customer" + " support.",
    resetPassword: "Set password",
    instructions: "Please enter a new password:",
    done: "Your password was reset successfully!",
    ok: "Ok"
  },
  setPw: {
    noToken: "There must have happened some kind of error: This is not a" + " proper password reset link. Please check again or contact customer" + " support.",
    resetPassword: "Save",
    instructions: "Please enter a password:",
    done: "Your password was saved!",
    ok: "Next"
  }
};
var de = {
  account: {
    mail: "Email",
    mailError: "Unglültige Email-Addresse. Bitte überprüfen Sie Ihre Eingabe.",
    mailRequired: "Bitte geben Sie Ihre Email-Addresse ein.",
    password: "Passwort",
    passwordError: "Passwort ungültig: Ihr Passwort muss mindestens sechs Zeichen lang sein.",
    passwordRequired: "Bitte geben Sie Ihr Passwort ein."
  },
  signup: {
    userExists: "Diese Email-Adresse wurde bereits bei uns registriert." + " Bitte benutzen Sie eine andere Adresse. Falls" + " Sie ihr Passwort vergessen haben sollten können Sie es ",
    signup: "Registrieren",
    done: "Wir haben Ihnen eine Email zur bestätigung Ihres Accounts geschickt. Bitte folgen Sie den Anweisungen in der Email um sich einzuloggen."
  },
  login: {
    login: "Jetzt einloggen",
    authWrong: "Nutzername oder Passwort sind falsch. Bitte überprüfen Sie Ihre Eingabe.",
    pwForgotten: "Passwort vergessen"
  },
  pwForgotten: {
    requestPwReset: "Passwort zurücksetzen",
    unknownEmail: "Wir konnten keinen Benutzer mit der angegenbenen E-Mail Addresse finden. Bitte überprüfen Sie Ihre Eingabe.",
    done: "Keine Sorge, wir haben Ihnen eine Email gesendet. Bitte folgen Sie" + " den Instruktionen in der Email um ein neues Passwort zu vergeben."
  },
  resetPw: {
    noToken: "Da ist etwas schiefgegangen... Der Link den Sie verwendet haben" + " ist kein gültiger Link um ein Passwort zurückzusetzen. Bitte" + " überprüfen Sie, ob Sie ihn richtig eingegeben haben oder" + " kontaktieren Sie unseren den Kundenservice.",
    instructions: "Bitte neues Passwort eingeben:",
    resetPassword: "Passwort festlegen",
    done: "Ihr Passwort wurde erfolgreich geändert!",
    ok: "Ok"
  },
  setPw: {
    noToken: "Da ist etwas schiefgegangen... Der Link den Sie verwendet haben" + " ist kein gültiger Link um ein Passwort zurückzusetzen. Bitte" + " überprüfen Sie, ob Sie ihn richtig eingegeben haben oder" + " kontaktieren Sie unseren den Kundenservice.",
    instructions: "Bitte geben Sie ein Passwort ein:",
    resetPassword: "Passwort speichern",
    done: "Ihr Passwort wurde erfolgreich gespeichert!",
    ok: "Weiter"
  }
};

var defLanguages = /*#__PURE__*/Object.freeze({
  __proto__: null,
  en: en,
  de: de
});

var useLogin = function useLogin(_ref) {
  var _ref$components = _ref.components,
      InputField = _ref$components.FormikInput,
      Button = _ref$components.Button,
      Link = _ref$components.Link,
      ErrorMessage = _ref$components.ErrorMessage,
      _ref$strings = _ref.strings,
      languages = _ref$strings === void 0 ? defLanguages : _ref$strings,
      get = _ref.api.get;

  var Login = function Login(_ref2) {
    var containerStyle = _ref2.containerStyle,
        _ref2$onLogin = _ref2.onLogin,
        onLogin = _ref2$onLogin === void 0 ? function () {} : _ref2$onLogin,
        _ref2$onLogout = _ref2.onLogout,
        onLogout = _ref2$onLogout === void 0 ? function () {} : _ref2$onLogout,
        login = _ref2.login,
        logout = _ref2.logout,
        logMeOut = _ref2.logMeOut,
        apiVersion = _ref2.apiVersion,
        user = _ref2.user,
        _ref2$pwForgottenUrl = _ref2.pwForgottenUrl,
        pwForgottenUrl = _ref2$pwForgottenUrl === void 0 ? "/passwordreset" : _ref2$pwForgottenUrl,
        _ref2$defaulLang = _ref2.defaulLang,
        defaulLang = _ref2$defaulLang === void 0 ? "en" : _ref2$defaulLang;
    var strings = languages[user.lang || defaulLang];

    var _useState = React.useState(false),
        _useState2 = _slicedToArray(_useState, 2),
        loading = _useState2[0],
        setLoading = _useState2[1];

    var _useState3 = React.useState(false),
        _useState4 = _slicedToArray(_useState3, 2),
        wrong = _useState4[0],
        setWrong = _useState4[1];

    React.useEffect(function () {
      if (user.id) {
        onLogin(user);
      }
    }, [user]);
    React.useEffect(function () {
      if (logMeOut) {
        logout();
        onLogout();
      }
    }, [logout, logMeOut]);

    var onSubmit = /*#__PURE__*/function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref3) {
        var email, password, req, me;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                email = _ref3.email, password = _ref3.password;

                if (!(email && password)) {
                  _context.next = 21;
                  break;
                }

                setWrong(false);
                setLoading(true);
                req = get("user/login").authPW(email, password).on(400, function () {}).on(401, function () {});

                if (apiVersion) {
                  req.v(apiVersion);
                }

                _context.prev = 6;
                _context.next = 9;
                return req;

              case 9:
                me = _context.sent;
                setLoading(false);
                login(_objectSpread2({
                  email: email
                }, me));
                _context.next = 19;
                break;

              case 14:
                _context.prev = 14;
                _context.t0 = _context["catch"](6);

                if (_context.t0) {
                  alert(_context.t0);
                }

                setWrong(true);
                setLoading(false);

              case 19:
                _context.next = 22;
                break;

              case 21:
                setWrong(true);

              case 22:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[6, 14]]);
      }));

      return function onSubmit(_x) {
        return _ref4.apply(this, arguments);
      };
    }();

    return /*#__PURE__*/React__default.createElement(formik.Formik, {
      initialValues: {
        email: "",
        password: ""
      },
      validationSchema: Yup.object({
        email: Yup.string().email(strings.account.mailError).required(strings.account.mailRequired),
        password: Yup.string().required(strings.account.passwordRequired)
      }),
      onSubmit: onSubmit
    }, /*#__PURE__*/React__default.createElement(formik.Form, {
      style: containerStyle,
      className: "login"
    }, /*#__PURE__*/React__default.createElement(InputField, {
      label: strings.account.mail,
      name: "email",
      type: "email"
    }), /*#__PURE__*/React__default.createElement(InputField, {
      label: strings.account.password,
      name: "password",
      type: "password"
    }), /*#__PURE__*/React__default.createElement("div", {
      className: "submit"
    }, /*#__PURE__*/React__default.createElement(Button, {
      submit: true,
      loading: loading
    }, strings.login.login), wrong && /*#__PURE__*/React__default.createElement(ErrorMessage, {
      message: strings.login.authWrong
    })), /*#__PURE__*/React__default.createElement("div", {
      className: "pwForgotten"
    }, /*#__PURE__*/React__default.createElement(Link, {
      to: pwForgottenUrl
    }, strings.login.pwForgotten))));
  };

  Login.propTypes = {
    lang: PropTypes.string,
    containerStyle: PropTypes.object,
    apiVersion: PropTypes.number,
    onLogin: PropTypes.func,
    onLogout: PropTypes.func,
    login: PropTypes.func,
    logout: PropTypes.func,
    logMeOut: PropTypes.bool,
    user: PropTypes.object,
    pwForgottenUrl: PropTypes.string,
    defaulLang: PropTypes.string
  };
  return React.useCallback(reactRedux.connect(function (_ref5) {
    var user = _ref5.user;
    return {
      user: user
    };
  }, {
    login: login,
    logout: logout
  })(Login), [InputField, Button, Link, ErrorMessage, get, languages]);
};

var useSignup = function useSignup(_ref) {
  var _ref$components = _ref.components,
      InputField = _ref$components.FormikInput,
      Button = _ref$components.Button,
      Link = _ref$components.Link,
      ErrorMessage = _ref$components.ErrorMessage,
      _ref$strings = _ref.strings,
      languages = _ref$strings === void 0 ? defLanguages : _ref$strings,
      post = _ref.api.post;

  var Signup = function Signup(_ref2) {
    var containerStyle = _ref2.containerStyle,
        _ref2$onSignup = _ref2.onSignup,
        onSignup = _ref2$onSignup === void 0 ? function () {} : _ref2$onSignup,
        apiVersion = _ref2.apiVersion,
        user = _ref2.user,
        _ref2$initialValues = _ref2.initialValues,
        initialValues = _ref2$initialValues === void 0 ? {} : _ref2$initialValues,
        _ref2$validation = _ref2.validation,
        validation = _ref2$validation === void 0 ? {} : _ref2$validation,
        firstFields = _ref2.firstFields,
        lastFields = _ref2.lastFields,
        _ref2$defaulLang = _ref2.defaulLang,
        defaulLang = _ref2$defaulLang === void 0 ? "en" : _ref2$defaulLang,
        _ref2$transformBefore = _ref2.transformBeforeSend,
        transformBeforeSend = _ref2$transformBefore === void 0 ? function (a) {
      return a;
    } : _ref2$transformBefore;
    var strings = languages[user.lang || defaulLang];

    var _useState = React.useState(false),
        _useState2 = _slicedToArray(_useState, 2),
        loading = _useState2[0],
        setLoading = _useState2[1];

    var _useState3 = React.useState(false),
        _useState4 = _slicedToArray(_useState3, 2),
        userExists = _useState4[0],
        setUserExists = _useState4[1];

    var _useState5 = React.useState(false),
        _useState6 = _slicedToArray(_useState5, 2),
        done = _useState6[0],
        setDone = _useState6[1];

    var validationSchema = Yup.object(_objectSpread2({
      email: Yup.string().email(strings.account.mailError).required(strings.account.mailRequired)
    }, validation));

    var onSubmit = /*#__PURE__*/function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(params) {
        var req;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return validationSchema.isValid(params);

              case 2:
                if (!_context.sent) {
                  _context.next = 19;
                  break;
                }

                setUserExists(false);
                setLoading(true);
                req = post("user").data(transformBeforeSend(params)).on({
                  status: 413,
                  error: "User exists"
                }, function () {
                  setUserExists(true);
                });

                if (apiVersion) {
                  req.v(apiVersion);
                }

                _context.prev = 7;
                _context.next = 10;
                return req;

              case 10:
                setLoading(false);
                onSignup(params);
                setDone(true);
                _context.next = 19;
                break;

              case 15:
                _context.prev = 15;
                _context.t0 = _context["catch"](7);

                if (_context.t0) {
                  alert(_context.t0);
                }

                setLoading(false);

              case 19:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[7, 15]]);
      }));

      return function onSubmit(_x) {
        return _ref3.apply(this, arguments);
      };
    }();

    if (done) {
      return /*#__PURE__*/React__default.createElement("div", null, strings.signup.done);
    }

    return /*#__PURE__*/React__default.createElement(formik.Formik, {
      initialValues: _objectSpread2({
        email: ""
      }, initialValues),
      validationSchema: validationSchema,
      onSubmit: onSubmit
    }, /*#__PURE__*/React__default.createElement(formik.Form, {
      style: containerStyle
    }, firstFields, /*#__PURE__*/React__default.createElement(InputField, {
      label: strings.account.mail,
      name: "email",
      type: "email"
    }), lastFields, /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(Button, {
      submit: true,
      loading: loading
    }, strings.signup.signup), userExists && /*#__PURE__*/React__default.createElement(ErrorMessage, {
      message: strings.signup.userExists
    }))));
  };

  Signup.propTypes = {
    lang: PropTypes.string,
    containerStyle: PropTypes.object,
    apiVersion: PropTypes.number,
    onSignup: PropTypes.func,
    user: PropTypes.object,
    defaulLang: PropTypes.string,
    initialValues: PropTypes.object,
    validation: PropTypes.object,
    firstFields: PropTypes.array,
    lastFields: PropTypes.array,
    transformBeforeSend: PropTypes.func
  };
  return React.useCallback(reactRedux.connect(function (_ref4) {
    var user = _ref4.user;
    return {
      user: user
    };
  }, {})(Signup), [InputField, Button, Link, ErrorMessage, post, languages]);
};

var useResetPassword = function useResetPassword(_ref) {
  var _ref$components = _ref.components,
      InputField = _ref$components.FormikInput,
      Button = _ref$components.Button,
      Link = _ref$components.Link,
      ErrorMessage = _ref$components.ErrorMessage,
      _ref$strings = _ref.strings,
      languages = _ref$strings === void 0 ? defLanguages : _ref$strings,
      put = _ref.api.put;

  var ResetPassword = function ResetPassword(_ref2) {
    var containerStyle = _ref2.containerStyle,
        _ref2$onResetPassword = _ref2.onResetPassword,
        onResetPassword = _ref2$onResetPassword === void 0 ? function () {} : _ref2$onResetPassword,
        _ref2$validatePasswor = _ref2.validatePassword,
        validatePassword = _ref2$validatePasswor === void 0 ? function (pw) {
      return !pw || pw.length >= 6;
    } : _ref2$validatePasswor,
        email = _ref2.email,
        token = _ref2.token,
        onDone = _ref2.onDone,
        login = _ref2.login,
        apiVersion = _ref2.apiVersion,
        user = _ref2.user,
        _ref2$defaulLang = _ref2.defaulLang,
        defaulLang = _ref2$defaulLang === void 0 ? "en" : _ref2$defaulLang,
        welcome = _ref2.welcome;
    var strings = languages[user.lang || defaulLang];
    var resetStrings = welcome ? strings.setPw : strings.resetPw;

    var _useState = React.useState(false),
        _useState2 = _slicedToArray(_useState, 2),
        loading = _useState2[0],
        setLoading = _useState2[1];

    var _useState3 = React.useState(false),
        _useState4 = _slicedToArray(_useState3, 2),
        tokenWrong = _useState4[0],
        setTokenWrong = _useState4[1];

    var _useState5 = React.useState(false),
        _useState6 = _slicedToArray(_useState5, 2),
        resetDone = _useState6[0],
        setResetDone = _useState6[1];

    var onSubmit = /*#__PURE__*/function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref3) {
        var password, req, me;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                password = _ref3.password;

                if (!(!email || !token)) {
                  _context.next = 4;
                  break;
                }

                setTokenWrong(true);
                return _context.abrupt("return");

              case 4:
                if (!password) {
                  _context.next = 23;
                  break;
                }

                setTokenWrong(false);
                setLoading(true);
                req = put("user").authPW(email, token).data({
                  password: password
                }).on({
                  status: 401,
                  error: "User not found"
                }, function () {
                  setTokenWrong(true);
                }).on({
                  status: 401,
                  error: "Unauthorized"
                }, function () {
                  setTokenWrong(true);
                });

                if (apiVersion) {
                  req.v(apiVersion);
                }

                _context.prev = 9;
                _context.next = 12;
                return req;

              case 12:
                me = _context.sent;
                setLoading(false);
                setResetDone(true);
                login(_objectSpread2({
                  email: email
                }, me));
                onResetPassword(me);
                _context.next = 23;
                break;

              case 19:
                _context.prev = 19;
                _context.t0 = _context["catch"](9);

                if (_context.t0) {
                  alert(_context.t0);
                }

                setLoading(false);

              case 23:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[9, 19]]);
      }));

      return function onSubmit(_x) {
        return _ref4.apply(this, arguments);
      };
    }();

    if (resetDone) {
      return /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("div", null, resetStrings.done), onDone && /*#__PURE__*/React__default.createElement(Button, {
        onClick: onDone
      }, resetStrings.ok));
    }

    return /*#__PURE__*/React__default.createElement(formik.Formik, {
      initialValues: {
        password: ""
      },
      validationSchema: Yup.object({
        password: Yup.string().test("customPwCheck", strings.account.passwordError, validatePassword).required(strings.account.passwordRequired)
      }),
      onSubmit: onSubmit
    }, /*#__PURE__*/React__default.createElement(formik.Form, {
      style: containerStyle
    }, /*#__PURE__*/React__default.createElement("div", null, resetStrings.instructions), /*#__PURE__*/React__default.createElement(InputField, {
      label: strings.account.password,
      name: "password",
      type: "password"
    }), /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(Button, {
      submit: true,
      loading: loading
    }, resetStrings.resetPassword), tokenWrong && /*#__PURE__*/React__default.createElement(ErrorMessage, {
      message: resetStrings.noToken
    }))));
  };

  ResetPassword.propTypes = {
    email: PropTypes.string,
    token: PropTypes.string,
    lang: PropTypes.string,
    containerStyle: PropTypes.object,
    apiVersion: PropTypes.number,
    login: PropTypes.func,
    onDone: PropTypes.func,
    onResetPassword: PropTypes.func,
    user: PropTypes.object,
    defaulLang: PropTypes.string,
    validatePassword: PropTypes.func,
    welcome: PropTypes.bool
  };
  return React.useCallback(reactRedux.connect(function (_ref5) {
    var user = _ref5.user;
    return {
      user: user
    };
  }, {
    login: login
  })(ResetPassword), [InputField, Button, Button, Link, ErrorMessage, put, languages]);
};

var useRequestPwReset = function useRequestPwReset(_ref) {
  var _ref$components = _ref.components,
      InputField = _ref$components.FormikInput,
      Button = _ref$components.Button,
      ErrorMessage = _ref$components.ErrorMessage,
      _ref$strings = _ref.strings,
      languages = _ref$strings === void 0 ? defLanguages : _ref$strings,
      post = _ref.api.post;

  var RequestPwReset = function RequestPwReset(_ref2) {
    var containerStyle = _ref2.containerStyle,
        _ref2$onRequestPasswo = _ref2.onRequestPasswordReset,
        onRequestPasswordReset = _ref2$onRequestPasswo === void 0 ? function () {} : _ref2$onRequestPasswo,
        apiVersion = _ref2.apiVersion,
        user = _ref2.user,
        _ref2$defaulLang = _ref2.defaulLang,
        defaulLang = _ref2$defaulLang === void 0 ? "en" : _ref2$defaulLang;
    var strings = languages[user.lang || defaulLang];

    var _useState = React.useState(false),
        _useState2 = _slicedToArray(_useState, 2),
        loading = _useState2[0],
        setLoading = _useState2[1];

    var _useState3 = React.useState(false),
        _useState4 = _slicedToArray(_useState3, 2),
        emailUnknown = _useState4[0],
        setEmailUnknown = _useState4[1];

    var _useState5 = React.useState(false),
        _useState6 = _slicedToArray(_useState5, 2),
        requestDone = _useState6[0],
        setRequestDone = _useState6[1];

    var onSubmit = /*#__PURE__*/function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref3) {
        var email, req;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                email = _ref3.email;

                if (!email) {
                  _context.next = 18;
                  break;
                }

                setEmailUnknown(false);
                setLoading(true);
                req = post("user/$1/reset", [email]).auth(false.auth).on(404, function () {
                  setEmailUnknown(true);
                });

                if (apiVersion) {
                  req.v(apiVersion);
                }

                _context.prev = 6;
                _context.next = 9;
                return req;

              case 9:
                setLoading(false);
                setRequestDone(true);
                onRequestPasswordReset();
                _context.next = 18;
                break;

              case 14:
                _context.prev = 14;
                _context.t0 = _context["catch"](6);

                if (_context.t0) {
                  console.log(_context.t0);
                }

                setLoading(false);

              case 18:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[6, 14]]);
      }));

      return function onSubmit(_x) {
        return _ref4.apply(this, arguments);
      };
    }();

    if (requestDone) {
      return /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("div", null, strings.pwForgotten.done));
    }

    return /*#__PURE__*/React__default.createElement(formik.Formik, {
      initialValues: {
        email: ""
      },
      validationSchema: Yup.object({
        email: Yup.string().email(strings.account.mailError).required(strings.account.mailRequired)
      }),
      onSubmit: onSubmit
    }, /*#__PURE__*/React__default.createElement(formik.Form, {
      style: containerStyle
    }, /*#__PURE__*/React__default.createElement(InputField, {
      label: strings.account.mail,
      name: "email",
      type: "email"
    }), /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(Button, {
      submit: true,
      loading: loading
    }, strings.pwForgotten.requestPwReset), emailUnknown && /*#__PURE__*/React__default.createElement(ErrorMessage, {
      message: strings.pwForgotten.unknownEmail
    }))));
  };

  RequestPwReset.propTypes = {
    lang: PropTypes.string,
    containerStyle: PropTypes.object,
    apiVersion: PropTypes.number,
    onRequestPasswordReset: PropTypes.func,
    user: PropTypes.object,
    defaulLang: PropTypes.string
  };
  return React.useCallback(reactRedux.connect(function (_ref5) {
    var user = _ref5.user;
    return {
      user: user
    };
  }, {})(RequestPwReset), [InputField, Button, ErrorMessage, post, languages]);
};

var loginStore = {
  user: user
};

exports.actions = index;
exports.loginStore = loginStore;
exports.strings = defLanguages;
exports.useLogin = useLogin;
exports.useRequestPasswordReset = useRequestPwReset;
exports.useResetPassword = useResetPassword;
exports.useSignup = useSignup;
//# sourceMappingURL=index.js.map
