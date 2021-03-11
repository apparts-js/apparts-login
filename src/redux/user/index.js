export let login = (user) => ({
  type: "USER_LOGIN",
  user,
});

export let logout = () => ({
  type: "USER_LOGOUT",
});

export let setLanguage = (lang) => ({
  type: "SET_LANGUAGE",
  lang,
});

const reducer = (types) => (state = {}, action = {}) => {
  switch (action.type) {
    case types.USER_LOGIN.name:
      return { ...action.user };
    case types.USER_LOGOUT.name:
      return {};
    case types.SET_LANGUAGE.name:
      return { ...state, lang: action.lang };
    default:
      return state;
  }
};

const actionNames = [logout().type, login().type, setLanguage().type];

export default {
  reducer,
  actionNames,
  login,
  logout,
};
