import * as actions from '../actions';

const global = (state = { }, action) => {
  switch(action.type) {

  case actions.STORE_TOKEN_AND_ID:
    return Object.assign({}, state, { token: action.token,
                                      id: action.id });
  case actions.STORE_EMAIL:
    return Object.assign({}, state, { email: action.email });

  case actions.STORE_NAME:
    return Object.assign({}, state, { name: action.name });

  default:
    return state;
  }
};

export default global;
