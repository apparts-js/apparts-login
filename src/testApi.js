import { useApi, Request } from "@apparts/api";

const URL = "http://localhost:3000/v/";

class MyRequest extends Request {
  getURL(apiVersion) {
    // Tell Request what the URL prefix is
    return URL + apiVersion;
  }
  getAPIVersion() {
    // Tell Request what the default APIVersion is
    return 1;
  }
}

// eslint-disable-next-line react-hooks/rules-of-hooks
const { get, put, patch, post, del } = useApi(MyRequest);
export { get, put, patch, post, del };
