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

export const billingDetailsValidationSchema = yup.object({
  name: yup
    .string()
    .required(),

  city: yup
    .string()
    .required(),

  country: yup
    .string()
    .required(),

  line1: yup
    .string()
    .required(),

  line2: yup
    .string(),

  district: yup
    .string()
    .required(),

  postalCode: yup
    .string()
    .required()
});