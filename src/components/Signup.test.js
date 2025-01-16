import React from "react";
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import useSignup from "./Signup";
import { withStore, store } from "../redux/testStore";
import * as api from "../testApi";
import {
  persistContract,
  postApiMock as _postApiMock,
} from "../tests/contracts";
const testName = "signup";
const postApiMock = _postApiMock(testName);
import axios from "axios";
import * as Yup from "yup";
import { FormikInput as InputField } from "@apparts/web-components";
import * as components from "@apparts/web-components";

jest.mock("axios");

const MySignup = (params) => {
  const Signup = useSignup({ api, components });
  return withStore(<Signup {...params} />);
};

let dateNowAll;
beforeEach(() => {
  dateNowAll = jest.spyOn(Date, "now").mockImplementation(() => 1575158400000);
});
afterEach(() => {
  dateNowAll.mockRestore();
});

describe("Signup component renders", () => {
  test("Should render signup dialog", async () => {
    render(<MySignup />);
    screen.getByRole("button", { name: "Register" });
    screen.getByLabelText("Email");
  });
  test("Should render in German", async () => {
    store.dispatch({ type: "SET_LANGUAGE", lang: "de" });
    render(<MySignup />);
    screen.getByRole("button", { name: "Registrieren" });
    screen.getByLabelText("Email");
  });
  test("Should render custom inputs", async () => {
    store.dispatch({ type: "SET_LANGUAGE", lang: "en" });
    render(
      <MySignup
        initialValues={{ before: "", after: "" }}
        validation={{
          before: Yup.string(),
          after: Yup.string().required("Missing"),
        }}
        firstFields={[<InputField key={1} name="before" label="First field" />]}
        lastFields={[<InputField key={2} name="after" label="Last field" />]}
      />
    );
    screen.getByRole("button", { name: "Register" });
    screen.getByLabelText("Email");
    screen.getByLabelText("First field");
    screen.getByLabelText("Last field");
  });
});
describe("Signup input validation", () => {
  test("Should render error on wrong/empty email", async () => {
    render(<MySignup />);
    const email = screen.getByLabelText("Email");
    expect(screen.getByRole("button", { name: "Register" })).toBeEnabled();
    await waitFor(() => userEvent.type(email, "test"));
    await waitFor(() => userEvent.tab());
    screen.getByText("Invalid email adress. Please check your input.");
    expect(screen.getByRole("button", { name: "Register" })).toBeEnabled();
    await waitFor(() => userEvent.clear(email));
    await waitFor(() => userEvent.tab());
    screen.getByText("Please enter your email adress.");
    expect(
      screen.queryByText("Invalid email adress. Please check your input.")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        "Your username or password is not correct. Please check your input."
      )
    ).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Register" })).toBeEnabled();
  });
  test("Should render error on wrong additional field", async () => {
    render(
      <MySignup
        initialValues={{ before: "", after: "" }}
        validation={{
          before: Yup.number().integer("Must be a whole Number"),
          after: Yup.string().required("This is missing"),
        }}
        firstFields={[<InputField key={1} name="before" label="First field" />]}
        lastFields={[<InputField key={2} name="after" label="Last field" />]}
      />
    );
    const first = screen.getByLabelText("First field");
    const second = screen.getByLabelText("Last field");
    await userEvent.type(first, "1.1");
    await userEvent.tab();
    await screen.findByText("Must be a whole Number");
    await userEvent.type(second, "test");
    await userEvent.tab();
    await userEvent.clear(second);
    await screen.findByText("This is missing");
    expect(screen.getByRole("button", { name: "Register" })).toBeEnabled();
  });
  test("Should not submit on missing field", async () => {
    const onSignup = jest.fn();
    render(<MySignup onSignup={onSignup} />);
    const email = screen.getByLabelText("Email");
    const button = screen.getByRole("button", { name: "Register" });
    await waitFor(() => userEvent.click(button));
    await screen.findByText("Please enter your email adress.");
    expect(button).toBeEnabled();
    await waitFor(() => userEvent.type(email, "test@test.de"));
    await waitFor(() =>
      expect(
        screen.queryByText("Please enter your email adress.")
      ).not.toBeInTheDocument()
    );
    expect(onSignup.mock.calls.length).toBe(0);
  });
  test("Should not submit on missing custom field", async () => {
    const onSignup = jest.fn();
    render(
      <MySignup
        onSignup={onSignup}
        initialValues={{ before: "", after: "" }}
        validation={{
          before: Yup.number().required("Must be Number"),
          after: Yup.string().required("This is missing"),
        }}
        firstFields={[<InputField key={1} name="before" label="First field" />]}
        lastFields={[<InputField key={2} name="after" label="Last field" />]}
      />
    );
    const email = screen.getByLabelText("Email");
    await waitFor(() => userEvent.type(email, "test@test.de"));

    expect(screen.queryByText("Must be Number")).not.toBeInTheDocument();
    expect(screen.queryByText("This is missing")).not.toBeInTheDocument();
    const button = screen.getByRole("button", { name: "Register" });
    await waitFor(() => userEvent.click(button));
    expect(screen.queryByText("Must be Number")).toBeInTheDocument();
    expect(screen.queryByText("This is missing")).toBeInTheDocument();
    expect(button).toBeEnabled();
    expect(onSignup.mock.calls.length).toBe(0);
  });
});

describe("Sign up", () => {
  test("Should submit and throw error on user exists", async () => {
    postApiMock(413, { error: "User exists" });
    const onSignup = jest.fn();
    render(<MySignup onSignup={onSignup} />);
    const email = screen.getByLabelText("Email");
    const button = screen.getByRole("button", { name: "Register" });
    await userEvent.type(email, "test@test.de");

    await waitFor(() =>
      expect(
        screen.queryByText("Invalid email adress. Please check your input.")
      ).not.toBeInTheDocument()
    );

    await waitFor(() => userEvent.click(button));
    await waitFor(() =>
      screen.queryByText(
        "Someone already registered using this email" +
          " address. Please register using another email address. If" +
          " you have forgotten your password you can reset it on the login page."
      )
    );
    await waitFor(() => expect(button).toBeEnabled());
    expect(onSignup.mock.calls.length).toBe(0);
    expect(axios.post.mock.calls.length).toBe(1);
    userEvent.click(button);
    await waitForElementToBeRemoved(
      screen.queryByText(
        "Someone already registered using this email" +
          " address. Please register using another email address. If" +
          " you have forgotten your password you can reset it on the login page."
      )
    );
  });
  test("Should use specified api version", async () => {
    postApiMock(413, { error: "User exists" });
    render(<MySignup apiVersion={2} />);
    const email = screen.getByLabelText("Email");
    await userEvent.type(email, "test@test.de");
    const button = screen.getByRole("button", { name: "Register" });
    await waitFor(() => userEvent.click(button));
    expect(axios.post.mock.calls[0][0]).toBe("http://localhost:3000/v/2/user?");
  });
  test("Should sign up successfully", async () => {
    postApiMock(200, "ok");
    const onSignup = jest.fn();
    render(<MySignup onSignup={onSignup} />);
    const email = screen.getByLabelText("Email");
    const button = screen.getByRole("button", { name: "Register" });
    await userEvent.type(email, "test2@test.de");
    await userEvent.click(button);
    await waitFor(() => expect(button).toBeDisabled());
    await waitFor(() => expect(onSignup.mock.calls.length).toBe(1));
    expect(onSignup.mock.calls[0][0]).toMatchObject({
      email: "test2@test.de",
    });
    expect(button).not.toBeInTheDocument();
    expect(email).not.toBeInTheDocument();
    screen.getByText(
      "We have send you an email to confirm your account. Please follow the instructions in the email to log in."
    );
  });
  test("Should sign up successfully with custom fields", async () => {
    postApiMock(200, "ok");
    const onSignup = jest.fn();
    render(
      <MySignup
        transformBeforeSend={({ before, ...rest }) => ({
          ...rest,
          before: parseInt(before) + 10,
        })}
        onSignup={onSignup}
        initialValues={{ before: "", after: "" }}
        validation={{
          before: Yup.number().required("Must be Number"),
          after: Yup.string().required("This is missing"),
        }}
        firstFields={[<InputField key={1} name="before" label="First field" />]}
        lastFields={[<InputField key={2} name="after" label="Last field" />]}
        apiVersion={2}
      />
    );
    const first = screen.getByLabelText("First field");
    await userEvent.type(first, "33");
    await waitFor(() => userEvent.tab());
    const email = screen.getByLabelText("Email");
    await userEvent.type(email, "test3@test.de");
    await waitFor(() => userEvent.tab());
    const second = screen.getByLabelText("Last field");
    await userEvent.type(second, "Yeha");

    const button = screen.getByRole("button", { name: "Register" });
    await userEvent.click(button);
    await waitFor(() => expect(button).toBeDisabled());
    await waitFor(() => expect(onSignup.mock.calls.length).toBe(1));
    expect(onSignup.mock.calls[0][0]).toMatchObject({
      email: "test3@test.de",
    });
    expect(button).not.toBeInTheDocument();
    expect(email).not.toBeInTheDocument();
    screen.getByText(
      "We have send you an email to confirm your account. Please follow the instructions in the email to log in."
    );
    expect(axios.post.mock.calls[0][0]).toBe("http://localhost:3000/v/2/user?");
    expect(axios.post.mock.calls[0][1]).toStrictEqual({
      email: "test3@test.de",
      before: 43,
      after: "Yeha",
    });
  });
});

test("Show contracts", () => {
  persistContract(testName);
});
