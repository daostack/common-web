import { request } from "../../../shared/utils";
import { API, METHODS } from "../../../shared/constants";

export default {
  login: (payload: unknown) => request(METHODS.POST, API.AUTH.LOGIN)(payload),
  registration: (payload: unknown) => request(METHODS.POST, API.AUTH.REGISTER)(payload),
  getUserInfo: () => request(METHODS.GET, API.USER.GET_USER_INFO)(),
};
