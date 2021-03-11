import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import useLogin from "./Login";
import { withStore, store } from "../redux/testStore";
import * as api from "../testApi";
import { persistContract, getApiMock as _getApiMock } from "../tests/contracts";
const testName = "login";
const getApiMock = _getApiMock(testName);
import axios from "axios";

import { sign as JWT } from "jsonwebtoken";
const JWTSECRET = "orietn093risent";

jest.mock("axios");

const MyLogin = (params) => {
  const Login = useLogin({ api });
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
    store.dispatch({ type: "SET_LANGUAGE", lang: "de" });
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
    store.dispatch({ type: "SET_LANGUAGE", lang: "en" });

    render(<MyLogin />);
    const email = screen.getByLabelText("Email");
    expect(screen.getByRole("button", { name: "Log in" })).toBeEnabled();
    await waitFor(() => userEvent.type(email, "test"));
    await waitFor(() => userEvent.tab());
    screen.getByText("Invalid email adress. Please check your input.");
    expect(screen.getByRole("button", { name: "Log in" })).toBeEnabled();
    await waitFor(() => userEvent.clear(email));
    screen.getByText("Please enter your email adress.");
    expect(
      screen.queryByText("Invalid email adress. Please check your input.")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        "Your username or password is not correct. Please check your input."
      )
    ).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Log in" })).toBeEnabled();
  });
  test("Should render error on touched password", async () => {
    render(<MyLogin />);
    const password = screen.getByLabelText("Password");
    await waitFor(() => userEvent.type(password, "test"));
    await waitFor(() => userEvent.tab());
    await waitFor(() => userEvent.clear(password));
    screen.getByText("Please enter your password.");
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
    expect(
      screen.queryByText("Please enter your password.")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        "Your username or password is not correct. Please check your input."
      )
    ).not.toBeInTheDocument();
    expect(onLogin.mock.calls.length).toBe(0);
  });
});

describe("Log in", () => {
  test("Should submit and throw error on wrong credetials", async () => {
    getApiMock(400, { error: "Not authorized" });
    render(<MyLogin />);
    const email = screen.getByLabelText("Email");
    const password = screen.getByLabelText("Password");
    const button = screen.getByRole("button", { name: "Log in" });
    await userEvent.type(email, "test@web.de");
    await waitFor(() => userEvent.tab());
    await userEvent.type(password, "123456576");
    await waitFor(() => userEvent.tab());
    expect(
      screen.queryByText("Please enter your password.")
    ).not.toBeInTheDocument();

    await waitFor(() => userEvent.click(button));
    await waitFor(() =>
      screen.getByText(
        "Your username or password is not correct. Please check your input."
      )
    );
    expect(button).toBeEnabled();
  });
  test("Should use specified api version", async () => {
    getApiMock(400, { error: "Not authorized" });
    render(<MyLogin apiVersion={2} />);
    const email = screen.getByLabelText("Email");
    const password = screen.getByLabelText("Password");
    await userEvent.type(email, "test@web.de");
    await userEvent.type(password, "123456576");
    const button = screen.getByRole("button", { name: "Log in" });
    await waitFor(() => userEvent.click(button));
    expect(axios.get.mock.calls[0][0]).toBe("http://localhost:3000/v/2/login?");
  });
  test("Should log in successfully", async () => {
    const jwt = JWT({ action: "login", id: 2 }, JWTSECRET);

    getApiMock(200, {
      id: 2,
      loginToken: "aroiet309lrstioen",
      apiToken: jwt,
    });
    const onLogin = jest.fn();
    render(<MyLogin onLogin={onLogin} />);
    const email = screen.getByLabelText("Email");
    const password = screen.getByLabelText("Password");
    const button = screen.getByRole("button", { name: "Log in" });
    await userEvent.type(email, "test@web.de");
    await userEvent.type(password, "123456576");
    userEvent.click(button);
    await waitFor(() => expect(button).toBeDisabled());
    await waitFor(() => expect(button).toBeEnabled());
    const { user } = store.getState();
    expect(user).toMatchObject({
      id: 2,
      loginToken: "aroiet309lrstioen",
      apiToken: jwt,
    });
    expect(onLogin.mock.calls.length).toBe(1);
    expect(onLogin.mock.calls[0][0]).toMatchObject({
      id: 2,
      loginToken: "aroiet309lrstioen",
      apiToken: jwt,
    });
  });
});

describe("Log out", () => {
  test("Should log out successfully", async () => {
    const onLogout = jest.fn();
    render(<MyLogin onLogout={onLogout} logMeOut />);
    screen.getByLabelText("Email");
    screen.getByLabelText("Password");
    const button = screen.getByRole("button", { name: "Log in" });
    await (() => expect(button).toBeEnabled());
    const { user } = store.getState();
    expect(user).toStrictEqual({});
    expect(onLogout.mock.calls.length).toBe(1);
  });
});

test("Show contracts", () => {
  persistContract(testName);
});
