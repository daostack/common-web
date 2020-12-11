import { CommonError } from './errors';
import { sleep } from './sleep';


/**
 * Continually polls an action until it's result is validated successfully
 *
 * @throws { CommonError } - If the max attempts are reached
 *
 * @param action - The actions, which result will be validated
 * @param validate - The validation function
 * @param interval - The interval between retries in seconds. *Default is 60*
 * @param maxAttempts - The max attempt after which an error will be thrown. *Default is 64*
 */
export const poll = async <T = any>(
  action: () => T | Promise<T>,
  validate: (result: T) => boolean | Promise<boolean>,
  interval = 60,
  maxAttempts = 64
): Promise<T> => {
  let currentAttempt = 0;

  const execute = async (): Promise<T> => {
    const result = await action();

    if (await validate(result)) {
      return result;
    } else {
      currentAttempt++;

      if (currentAttempt >= maxAttempts) {
        throw new CommonError('Max polling attempts reached!');
      }

      return (async () => {
        await sleep(interval);

        return execute();
      })();
    }
  };

  return execute();
};