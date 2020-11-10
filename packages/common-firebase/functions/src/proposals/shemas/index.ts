import * as yup from 'yup';

export const linkValidationSchema = yup.object({
  title: yup.string()
    .max(64),

  address: yup.string()
    .required()
    .url()
});