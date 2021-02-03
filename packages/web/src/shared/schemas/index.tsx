import Ajv from "ajv";
import _ from "lodash";

import authSchemas from "../../containers/Auth/api/schemas";

const ajv = new Ajv({ removeAdditional: true });

const allSchemas = {
  ...authSchemas,
};
const compiledSchemas = _.mapValues(allSchemas, (value: Record<string, unknown>) => ajv.compile(value));

export default compiledSchemas;
