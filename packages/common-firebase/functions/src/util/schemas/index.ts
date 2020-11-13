import * as yup from 'yup';

export const linkValidationSchema = yup.object({
  title: yup.string()
    .max(64),

  address: yup.string()
    .required()
    .url()
});

export const commonRuleValidationSchema = yup.object({
  title: yup
    .string()
    .required(),

  url: yup
    .string()
    .max(512) // @todo Rename
});

export const fileValidationSchema = yup.object({
  value: yup
    .string()
    .url()
    .required()
});