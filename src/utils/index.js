import { useEffect } from "react";
import { useSelector } from "react-redux";

const buildQueryString = (query) => {
  const values = Object.keys(query).map(
    (key) => `${key}=${encodeURIComponent(JSON.stringify(query[key]))}`
  );
  return "?" + values.join("&");
};

export const getRedirectUrl = (redirect, rsearch) => {
  let search = "";
  try {
    redirect = JSON.parse(decodeURIComponent(redirect));
    search = JSON.parse(decodeURIComponent(rsearch));
  } catch (e) {
    /*nothing*/
  }
  return redirect + search;
};

export const buildRedirector = (queryParams, redirectExcludes = []) => {
  const redirect = window.location.pathname.slice(1);
  let queryObj = {
    redirect,
    rsearch: decodeURIComponent(queryParams),
  };
  if (redirectExcludes.indexOf(redirect) !== -1 && !queryParams.redirect) {
    queryObj = {};
  }
  return { str: buildQueryString(queryObj), obj: queryObj };
};

export const buildGetLoggedInUser = (goToLogin) => {
  const user = useSelector(({ user }) => user);
  useEffect(() => {
    if (!user.id) {
      goToLogin();
    }
  }, [user.id, goToLogin]);
  return user;
};
