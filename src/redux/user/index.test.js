import React from "react";
import PropTypes from "prop-types";
import { withStore, store } from "../testStore";
import useLogin from "../../components/Login";
import { updateUser, renewApiToken } from "./index";
import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@testing-library/react";
import * as api from "../../testApi";
import {
  persistContract,
  getApiMock as _getApiMock,
} from "../../tests/contracts";
const testName = "redux-store";
const getApiMock = _getApiMock(testName);
import * as components from "@apparts/web-components";

import { sign as JWT } from "jsonwebtoken";
const JWTSECRET = "<change me>";

jest.mock("axios");

const Link = ({ to, children }) => <a href={to}>{children}</a>;
Link.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node,
};

const MyLogin = (params) => {
  const Login = useLogin({ api, components: { ...components, Link } });
  return withStore(<Login {...params} />);
};

let dateNowAll;
beforeEach(() => {
  dateNowAll = jest.spyOn(Date, "now").mockImplementation(() => 1575158400000);
});
afterEach(() => {
  dateNowAll.mockRestore();
});

describe("Renew login token", () => {
  test("Should renew login token", async () => {
    const jwt = JWT(
      { id: 3, action: "login", email: "test@gmail.com" },
      JWTSECRET,
      { expiresIn: "10 minutes" }
    );
    getApiMock(200, {
      id: 3,
      apiToken: jwt,
    });
    const onLogin = jest.fn();
    render(<MyLogin onLogin={onLogin} />);
    const email = screen.getByLabelText("Email");
    const password = screen.getByLabelText("Password");
    const button = screen.getByRole("button", { name: "Log in" });
    await userEvent.type(email, "test@gmail.com");
    await userEvent.type(password, "123456576");
    userEvent.click(button);
    await waitFor(() => expect(button).toBeDisabled());
    await waitFor(() => expect(button).toBeEnabled());

    const { user } = store.getState();

    expect(user).toMatchObject({
      user: {
        id: 3,
        apiToken: jwt,
      },
    });

    store.dispatch(updateUser({ apiToken: 123 }));

    expect(store.getState().user).toMatchObject({
      user: {
        id: 3,
        apiToken: 123,
      },
    });
    getApiMock(200, jwt);

    store.dispatch(renewApiToken(api));

    await waitFor(() =>
      expect(store.getState().user).toMatchObject({
        user: {
          id: 3,
          apiToken: jwt,
        },
      })
    );
  });
});

test("Show contracts", () => {
  persistContract(testName);
});
