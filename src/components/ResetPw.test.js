import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import useResetPassword from "./ResetPw";
import { withStore, store } from "../redux/testStore";
import * as api from "../testApi";
import { persistContract, putApiMock as _putApiMock } from "../tests/contracts";
const testName = "resetPw";
const putApiMock = _putApiMock(testName);
import axios from "axios";
import { sign as JWT } from "jsonwebtoken";
const JWTSECRET = "orietn093risent";

jest.mock("axios");

const MyPwReset = (params) => {
  const PwReset = useResetPassword({ api });
  return withStore(<PwReset {...params} />);
};

let dateNowAll;
beforeEach(() => {
  dateNowAll = jest.spyOn(Date, "now").mockImplementation(() => 1575158400000);
});
afterEach(() => {
  dateNowAll.mockRestore();
});

describe("ResetPw component renders", () => {
  test("Should render resetPw dialog", async () => {
    render(<MyPwReset />);
    screen.getByRole("button", { name: "Set password" });
    screen.getByLabelText("Password");
    screen.getByText("Please enter a new password:");
  });
  test("Should render in German", async () => {
    store.dispatch({ type: "SET_LANGUAGE", lang: "de" });
    render(<MyPwReset />);
    screen.getByRole("button", { name: "Passwort festlegen" });
    screen.getByLabelText("Passwort");
  });
  test("Should render as welcome dialog", async () => {
    store.dispatch({ type: "SET_LANGUAGE", lang: "en" });
    render(<MyPwReset welcome />);
    screen.getByRole("button", { name: "Save" });
    screen.getByLabelText("Password");
    screen.getByText("Please enter a password:");
  });
});
describe("ResetPw input validation", () => {
  test("Should render error on wrong/empty password", async () => {
    render(<MyPwReset />);
    const password = screen.getByLabelText("Password");
    expect(screen.getByRole("button", { name: "Set password" })).toBeEnabled();
    await waitFor(() => userEvent.type(password, "test"));
    await waitFor(() => userEvent.tab());
    screen.getByText(
      "Invalid password: The password must be at least six characters long. Please check your input."
    );
    expect(screen.getByRole("button", { name: "Set password" })).toBeEnabled();
    await waitFor(() => userEvent.clear(password));
    screen.getByText("Please enter your password.");
    expect(
      screen.queryByText(
        "Invalid password: The password must be at least six characters long. Please check your input."
      )
    ).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Set password" })).toBeEnabled();
  });

  test("Should not submit on missing field", async () => {
    const onReset = jest.fn();
    render(<MyPwReset onResetPassword={onReset} />);
    const password = screen.getByLabelText("Password");
    const button = screen.getByRole("button", { name: "Set password" });
    await waitFor(() => userEvent.click(button));
    screen.getByText("Please enter your password.");
    expect(button).toBeEnabled();
    await waitFor(() => userEvent.type(password, "3ulnftirs"));
    expect(
      screen.queryByText("Please enter your password.")
    ).not.toBeInTheDocument();
    expect(onReset.mock.calls.length).toBe(0);
  });
});

describe("Reset Pw", () => {
  test("Should submit and throw error on missing token", async () => {
    putApiMock(400, { error: "Authorization wrong" });
    const onReset = jest.fn();
    render(<MyPwReset onResetPassword={onReset} />);
    const password = screen.getByLabelText("Password");
    const button = screen.getByRole("button", { name: "Set password" });
    await userEvent.type(password, "109330-");
    await waitFor(() =>
      expect(
        screen.queryByText(
          "Invalid password: The password must be at least six characters long. Please check your input."
        )
      ).not.toBeInTheDocument()
    );
    await waitFor(() => userEvent.click(button));
    await waitFor(() =>
      expect(
        screen.queryByText(
          "There must have happened some kind of error: This is not a" +
            " proper password reset link. Please check again or contact customer" +
            " support."
        )
      ).toBeInTheDocument()
    );
    expect(button).toBeEnabled();
    expect(onReset.mock.calls.length).toBe(0);
  });
  test("Should submit and throw error on invalid token", async () => {
    putApiMock(400, { error: "Authorization wrong" });
    const onReset = jest.fn();
    render(<MyPwReset token="abc" email="abc" onResetPassword={onReset} />);
    const password = screen.getByLabelText("Password");
    const button = screen.getByRole("button", { name: "Set password" });
    await userEvent.type(password, "109330-");
    await waitFor(() => userEvent.click(button));
    await waitFor(() =>
      expect(
        screen.queryByText(
          "There must have happened some kind of error: This is not a" +
            " proper password reset link. Please check again or contact customer" +
            " support."
        )
      ).toBeInTheDocument()
    );
    expect(button).toBeEnabled();
    expect(axios.put.mock.calls.length).toBe(1);
  });
  test("Should use specified api version", async () => {
    putApiMock(400, { error: "Authorization wrong" });
    render(<MyPwReset email="test" token="abc" apiVersion={2} />);
    const password = screen.getByLabelText("Password");
    await userEvent.type(password, "test@web.de");
    const button = screen.getByRole("button", { name: "Set password" });
    await waitFor(() => userEvent.click(button));
    expect(axios.put.mock.calls[0][0]).toBe("http://localhost:3000/v/2/user?");
  });
  test("Should reset successfully", async () => {
    const jwt = JWT({ action: "login", id: 2 }, JWTSECRET);
    putApiMock(200, {
      id: 2,
      loginToken: "aroiet309lrstioen",
      apiToken: jwt,
    });
    const onResetPw = jest.fn();
    render(
      <MyPwReset
        email="test@test.de"
        token="abcABC"
        onResetPassword={onResetPw}
      />
    );
    const password = screen.getByLabelText("Password");
    const button = screen.getByRole("button", { name: "Set password" });
    await userEvent.type(password, "12345678");
    userEvent.click(button);
    await waitFor(() => expect(button).toBeDisabled());
    await waitFor(() => expect(button).toBeEnabled());
    const { user } = store.getState();
    expect(user).toMatchObject({
      id: 2,
      loginToken: "aroiet309lrstioen",
      apiToken: jwt,
    });
    expect(onResetPw.mock.calls.length).toBe(1);
    expect(onResetPw.mock.calls[0][0]).toMatchObject({
      id: 2,
      loginToken: "aroiet309lrstioen",
      apiToken: jwt,
    });
  });
});

test("Show contracts", () => {
  persistContract(testName);
});
