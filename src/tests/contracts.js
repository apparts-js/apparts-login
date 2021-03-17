import fs from "fs";
import axios from "axios";

const contracts = {};
const apiContractWriter = (testName, context, status, returns) => {
  contracts[testName] = contracts[testName] || [];
  return async (...params) => {
    contracts[testName].push({
      context,
      status,
      returns,
      params,
    });
    if (status >= 400) {
      throw {
        response: { status, data: returns },
      };
    }
    return { data: returns };
  };
};

const putApiMock = (testName) => (status, returns) => {
  axios.put.mockImplementation(
    apiContractWriter(testName, "put", status, returns)
  );
};

const getApiMock = (testName) => (status, returns) => {
  axios.get.mockImplementation(
    apiContractWriter(testName, "get", status, returns)
  );
};

const postApiMock = (testName) => (status, returns) => {
  axios.post.mockImplementation(
    apiContractWriter(testName, "post", status, returns)
  );
};

const persistContract = (testName) => {
  let apiContract = {};
  try {
    apiContract = JSON.parse(fs.readFileSync("./apiContract.json").toString());
  } catch (e) {}
  fs.writeFileSync(
    "./apiContract.json",
    JSON.stringify(
      { ...apiContract, [testName]: contracts[testName] },
      undefined,
      2
    )
  );
};

export {
  apiContractWriter,
  persistContract,
  putApiMock,
  getApiMock,
  postApiMock,
};
