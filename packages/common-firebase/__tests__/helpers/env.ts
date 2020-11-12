// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import merge from 'deepmerge';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import envSecrets from '../../env/staging/env_secrets.json';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import envConfig from "../../env/staging/env_config.json";

export const env = merge(envSecrets, envConfig) as any;