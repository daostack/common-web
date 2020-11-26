import * as yup from 'yup';

export const linkValidationSchema = yup.object({
  title: yup.string()
    .max(64),

  value: yup.string()
    .required()
    .url()
});

export const commonRuleValidationSchema = yup.object({
  title: yup
    .string()
    .required(),

  value: yup
    .string()
    .max(512)
});

export const commonLinkValidationScheme = yup.object({
  title: yup
    .string()
    .required(),

  value: yup
    .string()
    .url()
    .required()
})

export const fileValidationSchema = yup.object({
  value: yup
    .string()
    .url()
    .required()
});

export const imageValidationSchema = yup.object({
  value: yup
    .string()
    .url()
    .required()
});