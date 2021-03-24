export let renewApiToken = (api) => async (dispatch, getState) => {
  const {
    user: { email, loginToken },
  } = getState();
  const apiToken = await api.get("user/apiToken").authPW(email, loginToken);
  dispatch(updateUser({ apiToken }));
};

export const updateUser = (user) => ({
  type: "USER_UPDATE",
  user,
});

export const login = (user) => ({
  type: "USER_LOGIN",
  user,
});

export const logout = () => ({
  type: "USER_LOGOUT",
});

export const setLanguage = (lang) => ({
  type: "SET_LANGUAGE",
  lang,
});

const reducer = (types) => (state = {}, action = {}) => {
  switch (action.type) {
    case types.USER_UPDATE.name:
      return { ...state, ...action.user };
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

const actionNames = [
  logout().type,
  login().type,
  setLanguage().type,
  updateUser().type,
];

export const getUserDataFromApiToken = (user) => {
  try {
    return JSON.parse(atob(user.apiToken.split(".")[1])) || {};
  } catch (e) {
    return {};
  }
};

export default {
  reducer,
  actionNames,
  login,
  logout,
};
