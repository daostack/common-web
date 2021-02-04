import { API, METHODS, SCHEMAS } from "../../../shared/constants";

export const commonLoginSchema = {
  type: "object",
  required: ["token"],
  properties: {
    token: { type: "string" },
  },
  additionalProperties: false,
};

export default {
  [`${API.AUTH.LOGIN}${SCHEMAS.REQUEST}${METHODS.POST}`]: {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: { type: "string" },
      password: { type: "string" },
    },
    additionalProperties: false,
  },
  [`${API.AUTH.LOGIN}${SCHEMAS.RESPONSE}${METHODS.POST}`]: commonLoginSchema,
  [`${API.AUTH.REGISTER}${SCHEMAS.REQUEST}${METHODS.POST}`]: {
    type: "object",
    required: ["email", "password", "firstName", "lastName"],
    properties: {
      email: { type: "string" },
      password: { type: "string" },
      firstName: { type: "string" },
      lastName: { type: "string" },
    },
    additionalProperties: false,
  },
  [`${API.AUTH.REGISTER}${SCHEMAS.RESPONSE}${METHODS.POST}`]: commonLoginSchema,
};
