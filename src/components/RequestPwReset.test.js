import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import useRequestPwReset from "./RequestPwReset";
import { withStore, store } from "../redux/testStore";
import * as api from "../testApi";
import {
  persistContract,
  postApiMock as _postApiMock,
} from "../tests/contracts";
const testName = "requestPwReset";
const postApiMock = _postApiMock(testName);
import axios from "axios";
import * as components from "@apparts/web-components";

jest.mock("axios");

const MyPwReset = (params) => {
  const PwReset = useRequestPwReset({ api, components });
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
    screen.getByRole("button", { name: "Reset password" });
    screen.getByLabelText("Email");
  });
  test("Should render in German", async () => {
    store.dispatch({ type: "SET_LANGUAGE", lang: "de" });
    render(<MyPwReset />);
    screen.getByRole("button", { name: "Passwort zurücksetzen" });
    screen.getByLabelText("Email");
  });
});
describe("ResetPw input validation", () => {
  test("Should render error on wrong/empty email", async () => {
    store.dispatch({ type: "SET_LANGUAGE", lang: "en" });

    render(<MyPwReset />);
    const email = screen.getByLabelText("Email");
    expect(
      screen.getByRole("button", { name: "Reset password" })
    ).toBeEnabled();
    await waitFor(() => userEvent.type(email, "test"));
    await waitFor(() => userEvent.tab());
    screen.getByText("Invalid email adress. Please check your input.");
    expect(
      screen.getByRole("button", { name: "Reset password" })
    ).toBeEnabled();
    await waitFor(() => userEvent.clear(email));
    screen.getByText("Please enter your email adress.");
    expect(
      screen.queryByText("Invalid email adress. Please check your input.")
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Reset password" })
    ).toBeEnabled();
  });

  test("Should not submit on missing field", async () => {
    const onReset = jest.fn();
    render(<MyPwReset onRequestPwReset={onReset} />);
    const email = screen.getByLabelText("Email");
    const button = screen.getByRole("button", { name: "Reset password" });
    await waitFor(() => userEvent.click(button));
    screen.getByText("Please enter your email adress.");
    expect(button).toBeEnabled();
    await waitFor(() => userEvent.type(email, "test@test.de"));
    expect(
      screen.queryByText("Please enter your email adress.")
    ).not.toBeInTheDocument();
    expect(onReset.mock.calls.length).toBe(0);
  });
});

describe("Reset Pw", () => {
  test("Should submit and throw error on unknown email", async () => {
    postApiMock(404, { error: "User not found" });
    const onReset = jest.fn();
    render(<MyPwReset onRequestPwReset={onReset} />);
    const email = screen.getByLabelText("Email");
    const button = screen.getByRole("button", { name: "Reset password" });
    await userEvent.type(email, "test100@web.de");
    await waitFor(() => userEvent.click(button));
    await waitFor(() =>
      screen.getByText(
        "We could not find a user with the entered email adress. Please check your input."
      )
    );
    expect(button).toBeEnabled();
    expect(onReset.mock.calls.length).toBe(0);
  });
  test("Should use specified api version", async () => {
    postApiMock(404, { error: "User not found" });
    render(<MyPwReset apiVersion={2} />);
    const email = screen.getByLabelText("Email");
    await userEvent.type(email, "test100@web.de");
    const button = screen.getByRole("button", { name: "Reset password" });
    await waitFor(() => userEvent.click(button));
    expect(axios.post.mock.calls[0][0]).toBe(
      "http://localhost:3000/v/2/user/test100%40web.de/reset?"
    );
  });
  test("Should reset successfully", async () => {
    postApiMock(200, "ok");
    const onResetPw = jest.fn();
    render(<MyPwReset onRequestPasswordReset={onResetPw} />);
    const email = screen.getByLabelText("Email");
    const button = screen.getByRole("button", { name: "Reset password" });
    await userEvent.type(email, "test@web.de");
    userEvent.click(button);
    await waitFor(() => expect(button).toBeDisabled());
    await waitFor(() => expect(button).toBeEnabled());
    expect(onResetPw.mock.calls.length).toBe(1);
    await waitFor(() =>
      expect(
        screen.queryByText(
          "Don't worry, we have send you an email to the specified address." +
            " Please follow the instructions in the email to set a new password."
        )
      ).toBeInTheDocument()
    );
  });
});

test("Show contracts", () => {
  persistContract(testName);
});
