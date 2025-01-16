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
import * as components from "@apparts/web-components";
import { sign as JWT } from "jsonwebtoken";
const JWTSECRET = "<change me>";

jest.mock("axios");

const MyPwReset = (params) => {
  const PwReset = useResetPassword({ api, components });
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
    await waitFor(() =>
      expect(
        screen.queryByRole("button", { name: "Set password" })
      )?.toBeEnabled()
    );
    await waitFor(() => userEvent.clear(password));
    await screen.findByText("Please enter your password.");
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
    await screen.findByText("Please enter your password.");
    expect(button).toBeEnabled();
    await waitFor(() => userEvent.type(password, "3ulnftirs"));
    await waitFor(() =>
      expect(
        screen.queryByText("Please enter your password.")
      ).not.toBeInTheDocument()
    );
    expect(onReset.mock.calls.length).toBe(0);
  });
});

describe("Reset Pw", () => {
  test("Should submit and throw error on missing token", async () => {
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
  test("Should submit and throw error on invalid user", async () => {
    putApiMock(401, { error: "User not found" });
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
  test("Should submit and throw error on wrong token", async () => {
    putApiMock(401, { error: "Unauthorized" });
    const onReset = jest.fn();
    render(
      <MyPwReset token="abc!" email="test@test.de" onResetPassword={onReset} />
    );
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
    putApiMock(401, { error: "User not found" });
    render(<MyPwReset email="test" token="abc" apiVersion={2} />);
    const password = screen.getByLabelText("Password");
    await userEvent.type(password, "test@web.de");
    const button = screen.getByRole("button", { name: "Set password" });
    await waitFor(() => userEvent.click(button));
    expect(axios.put.mock.calls[0][0]).toBe("http://localhost:3000/v/2/user?");
  });
  test("Should reset successfully", async () => {
    const jwt = JWT(
      { id: 2, action: "login", email: "test@test.de" },
      JWTSECRET,
      { expiresIn: "10 minutes" }
    );
    putApiMock(200, {
      id: 2,
      loginToken: new Buffer("aroiet309lrstioen").toString("base64"),
      apiToken: jwt,
    });
    const onResetPw = jest.fn();
    render(
      <MyPwReset
        email="test@test.de"
        token="cmVzZXQ="
        onResetPassword={onResetPw}
      />
    );
    const password = screen.getByLabelText("Password");
    const button = screen.getByRole("button", { name: "Set password" });
    await userEvent.type(password, "12345678");
    userEvent.click(button);
    await waitFor(() => expect(button).toBeDisabled());
    await waitFor(() => {
      const { user } = store.getState();
      expect(user).toMatchObject({
        id: 2,
        loginToken: new Buffer("aroiet309lrstioen").toString("base64"),
        apiToken: jwt,
      });
    });
    expect(onResetPw.mock.calls.length).toBe(1);
    expect(onResetPw.mock.calls[0][0]).toMatchObject({
      id: 2,
      loginToken: new Buffer("aroiet309lrstioen").toString("base64"),
      apiToken: jwt,
    });
    await waitFor(() =>
      expect(
        screen.queryByText("Your password was reset successfully!")
      ).toBeInTheDocument()
    );
    expect(screen.queryByLabelText("Ok")).not.toBeInTheDocument();
  });
  test("Should show ok button after reset", async () => {
    const jwt = JWT(
      { id: 4, action: "login", email: "test2@gmail.com" },
      JWTSECRET,
      { expiresIn: "10 minutes" }
    );
    putApiMock(200, {
      id: 4,
      loginToken: new Buffer("aroiet309lrstioen").toString("base64"),
      apiToken: jwt,
    });
    const onResetPw = jest.fn();
    const onDone = jest.fn();
    render(
      <MyPwReset
        email="test2@gmail.com"
        token="cmVzZXQ="
        onResetPassword={onResetPw}
        onDone={onDone}
      />
    );
    const password = screen.getByLabelText("Password");
    const button = screen.getByRole("button", { name: "Set password" });
    await userEvent.type(password, "12345678");
    userEvent.click(button);
    await waitFor(() => expect(button).toBeDisabled());
    await waitFor(() =>
      expect(
        screen.queryByText("Your password was reset successfully!")
      ).toBeInTheDocument()
    );
    expect(onDone.mock.calls.length).toBe(0);
    const okButton = screen.getByRole("button", { name: "Ok" });
    userEvent.click(okButton);
    await waitFor(() => expect(onDone.mock.calls.length).toBe(1));
  });
});

test("Show contracts", () => {
  persistContract(testName);
});
