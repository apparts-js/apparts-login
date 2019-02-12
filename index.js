import { Login } from './client/screens/Signup';
import { Signup } from './client/screens/Login';

import Routes from './server/routes/user';
import Model from './server/model/user';
import { Errors } from './server/util/errors';

const Client = {
  Login, Signup
};

const Server = {
  Routes: { User: Routes }, Models: { User: Model }, Errors
};

export { Client, Server };
