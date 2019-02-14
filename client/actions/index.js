"use strict";

import Base64 from 'base-64';


export const USER_LOGOUT = 'USER_LOGOUT';
export const STORE_TOKEN_AND_ID = 'STORE_TOKEN_AND_ID';
export const STORE_EMAIL = 'STORE_EMAIL';
export const STORE_NAME = 'STORE_NAME';
export const SET_LANGUAGE = 'SET_LANGUAGE';

export let logout = () => ({
  type: 'USER_LOGOUT'
});

export let storeTokenAndId = (email, token, id) => ({
  type: STORE_TOKEN_AND_ID,
  token: Base64.encode(email + ':' + token),
  id: id
});

export let storeEmail = (email) => ({
  type: STORE_EMAIL, email
});

export let storeName = (name) => ({
  type: STORE_NAME, name
});

export let setLanguage = (lang) => ({
  type: SET_LANGUAGE, lang
});
