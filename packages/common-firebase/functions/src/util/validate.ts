import { ObjectSchema } from 'yup';

// export const validate = async <T extends Record<string, unknown>>(payload: T, schema: ObjectSchema<T>, mutatePayload = true): Promise<void> => {
//
// }

// @todo Write doc
export const validate = async <T extends any>(payload: T, schema: ObjectSchema, mutatePayload = true): Promise<void> => {
  try {
    await schema.isValid(payload);
  } catch (e) {

  }
}