// const merge = require('deepmerge');
import merge from 'deepmerge';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import envSecrets from '../../env/dev/env_secrets.dev.json';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import envConfig from "../../env/dev/env_config.dev.json";

export const env = merge(envSecrets, envConfig) as any;