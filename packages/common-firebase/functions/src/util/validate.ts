import * as yup from 'yup';
import * as _ from 'lodash';

import { ObjectSchema } from 'yup';

import { CommonError, ValidationError } from './errors';

/**
 * Validates the provided payload against the schema and throw formatted
 * validation error on fail. On success it returns void
 *
 * @param payload - The object, that is being validated
 * @param schema - The schema against witch the payload is being validated
 *
 * @throws { CommonError } - If error occurs, that is not validation error
 * @throws { ValidationError } - If the payload fails the validation against the schema
 *
 * @returns Promise
 */
export const validate = async <T extends any>(payload: T, schema: ObjectSchema): Promise<void> => {
  try {
    await schema
      .test('no-unknown', 'No unknown keys are allowed', function (value) {
        const providedKeys = Object.keys(value);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const knownKeys = Object.keys(this.schema.fields);
        const unknownKeys = _.without(providedKeys, ...knownKeys); // lodash

        if (unknownKeys.length) {
          return this.createError({
            message: `No unknown keys are allowed. Unknown keys: ${unknownKeys.join(', ')}`
          });
        }

        return true;
      })
      .validate(payload, {
        abortEarly: false
      });
  } catch (e) {
    if (!(e instanceof yup.ValidationError)) {
      throw new CommonError('Unknown error occurred while doing the validation', {
        error: e,
        validatorPayload: {
          schema,
          payload
        }
      });
    }
    console.trace('Validation failed with payload', payload);

    console.log('Validation Errors:', e.errors);

    throw new ValidationError(e);
  }
};