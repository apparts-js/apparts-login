import React from "react";
import PropTypes from "prop-types";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import useLogin from "./Login";
import { withStore, store } from "../redux/testStore";
import { setLanguage } from "../redux/user";
import * as api from "../testApi";
import { persistContract, getApiMock as _getApiMock } from "../tests/contracts";
const testName = "login";
const getApiMock = _getApiMock(testName);
import axios from "axios";
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

describe("Login component renders", () => {
  test("Should render login dialog", async () => {
    render(<MyLogin />);
    screen.getByRole("button", { name: "Log in" });
    screen.getByLabelText("Email");
    screen.getByLabelText("Password");
    expect(screen.getByRole("link", { name: "Password forgotten" }).href).toBe(
      "http://localhost/passwordreset"
    );
  });
  test("Should use custom pwForgottenUrl", async () => {
    render(<MyLogin pwForgottenUrl="/testMe" />);
    expect(screen.getByRole("link", { name: "Password forgotten" }).href).toBe(
      "http://localhost/testMe"
    );
  });
  test("Should render in German", async () => {
    store.dispatch(setLanguage("de"));
    render(<MyLogin />);
    screen.getByRole("button", { name: "Jetzt einloggen" });
    screen.getByLabelText("Email");
    screen.getByLabelText("Passwort");
    expect(screen.getByRole("link", { name: "Passwort vergessen" }).href).toBe(
      "http://localhost/passwordreset"
    );
  });
});
describe("Login input validation", () => {
  test("Should render error on wrong/empty email", async () => {
    store.dispatch(setLanguage("en"));

    render(<MyLogin />);
    const email = screen.getByLabelText("Email");
    expect(screen.getByRole("button", { name: "Log in" })).toBeEnabled();
    await waitFor(() => userEvent.type(email, "test"));
    await waitFor(() => userEvent.tab());
    screen.getByText("Invalid email adress. Please check your input.");
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Log in" })).toBeEnabled()
    );
    await waitFor(() => userEvent.clear(email));
    await screen.findByText("Please enter your email adress.");
    await waitFor(() =>
      expect(
        screen.queryByText("Invalid email adress. Please check your input.")
      ).not.toBeInTheDocument()
    );
    await waitFor(() =>
      expect(
        screen.queryByText(
          "Your username or password is not correct. Please check your input."
        )
      ).not.toBeInTheDocument()
    );
    expect(screen.getByRole("button", { name: "Log in" })).toBeEnabled();
  });
  test("Should render error on touched password", async () => {
    render(<MyLogin />);
    const password = screen.getByLabelText("Password");
    await waitFor(() => userEvent.type(password, "test"));
    await waitFor(() => userEvent.tab());
    await waitFor(() => userEvent.clear(password));
    await screen.findByText("Please enter your password.");
    expect(
      screen.queryByText(
        "Your username or password is not correct. Please check your input."
      )
    ).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Log in" })).toBeEnabled();
  });
  test("Should not submit on missing field", async () => {
    const onLogin = jest.fn();
    render(<MyLogin onLogin={onLogin} />);
    const email = screen.getByLabelText("Email");
    const password = screen.getByLabelText("Password");
    const button = screen.getByRole("button", { name: "Log in" });
    await waitFor(() => userEvent.type(email, "test@test.de"));
    expect(
      screen.queryByText("Please enter your password.")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        "Your username or password is not correct. Please check your input."
      )
    ).not.toBeInTheDocument();
    await waitFor(() => userEvent.click(button));
    screen.getByText("Please enter your password.");
    expect(button).toBeEnabled();
    await waitFor(() => userEvent.type(password, "123456576"));
    await waitFor(() =>
      expect(
        screen.queryByText("Please enter your password.")
      ).not.toBeInTheDocument()
    );

    await waitFor(() =>
      expect(
        screen.queryByText(
          "Your username or password is not correct. Please check your input."
        )
      ).not.toBeInTheDocument()
    );
    expect(onLogin.mock.calls.length).toBe(0);
  });
});

describe("Log in", () => {
  test("Should submit and throw error on wrong credetials", async () => {
    getApiMock(401, { error: "Unauthorized" });
    render(<MyLogin />);
    const email = screen.getByLabelText("Email");
    const password = screen.getByLabelText("Password");
    const button = screen.getByRole("button", { name: "Log in" });
    await userEvent.type(email, "test@web.de");
    await waitFor(() => userEvent.tab());
    await userEvent.type(password, "nope,Wrong");
    await waitFor(() => userEvent.tab());

    await waitFor(() =>
      expect(
        screen.queryByText("Please enter your password.")
      ).not.toBeInTheDocument()
    );

    await waitFor(() => userEvent.click(button));
    await waitFor(() =>
      screen.getByText(
        "Your username or password is not correct. Please check your input."
      )
    );
    expect(button).toBeEnabled();
  });
  test("Should submit and throw error on too often", async () => {
    getApiMock(425, { error: "Login failed, too often." });
    render(<MyLogin />);
    const email = screen.getByLabelText("Email");
    const password = screen.getByLabelText("Password");
    const button = screen.getByRole("button", { name: "Log in" });
    await userEvent.type(email, "test@web.de");
    await waitFor(() => userEvent.tab());
    await userEvent.type(password, "nope,Wrong");
    await waitFor(() => userEvent.tab());
    expect(
      screen.queryByText("Please enter your password.")
    ).not.toBeInTheDocument();

    await waitFor(() => userEvent.click(button));
    await waitFor(() =>
      screen.getByText("You tried to log in too often. Please try later again.")
    );
    expect(button).toBeEnabled();
  });
  test("Should use specified api version", async () => {
    getApiMock(401, { error: "Unauthorized" });
    render(<MyLogin apiVersion={2} />);
    const email = screen.getByLabelText("Email");
    const password = screen.getByLabelText("Password");
    await userEvent.type(email, "test@web.de");
    await userEvent.type(password, "nope,Wrong");
    const button = screen.getByRole("button", { name: "Log in" });
    await waitFor(() => userEvent.click(button));
    expect(axios.get.mock.calls[0][0]).toBe(
      "http://localhost:3000/v/2/user/login?"
    );
  });
  test("Should log in successfully", async () => {
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
      user: { id: 3, apiToken: jwt },
    });
    expect(onLogin.mock.calls.length).toBe(1);
    expect(onLogin.mock.calls[0][0]).toMatchObject({
      id: 3,
      apiToken: jwt,
    });
  });
});

describe("Log out", () => {
  test("Should log out successfully", async () => {
    const onLogin = jest.fn();
    const onLogout = jest.fn();
    render(<MyLogin onLogin={onLogin} onLogout={onLogout} logMeOut />);
    screen.getByLabelText("Email");
    screen.getByLabelText("Password");
    const button = screen.getByRole("button", { name: "Log in" });
    await (() => expect(button).toBeEnabled());
    const { user } = store.getState();
    expect(user).toStrictEqual({ user: null });
    await waitFor(() => expect(onLogout.mock.calls.length).toBe(1));
    await waitFor(() => expect(onLogin.mock.calls.length).toBe(0));
  });
});

test("Show contracts", () => {
  persistContract(testName);
});
