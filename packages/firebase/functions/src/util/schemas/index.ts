import * as yup from 'yup';
import { urlRegex } from '../regex';

const isDistrictRequired = (country: string): boolean =>
  country === 'US' || country === 'CA';

export const linkValidationSchema = yup.object({
  title: yup.string()
    .max(64),

  value: yup.string()
    .required()
    .test('url', 'You must provide a valid URL', (value) => {
      return new RegExp(urlRegex).test(value);
    })
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
    .test('url', 'You must provide a valid URL', (value) => {
      return new RegExp(urlRegex).test(value);
    })
    .required()
});

export const fileValidationSchema = yup.object({
  value: yup
    .string()
    .test('url', 'You must provide a valid URL', (value) => {
      return new RegExp(urlRegex).test(value);
    })
    .required()
});

export const imageValidationSchema = yup.object({
  value: yup
    .string()
    .test('url', 'You must provide a valid URL', (value) => {
      return new RegExp(urlRegex).test(value);
    })
    .required()
});

export const billingDetailsValidationSchema = yup.object({
  name: yup
    .string()
    .matches(/^[a-zA-Z'. ]*$/, 'You name can only contain latin characters and spaces.')
    .test('Must provide at least two names', 'You must provide your fist and last name', (value) => {
      return value?.split(' ').length >= 2;
    })
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
    .when('country', {
      is: isDistrictRequired,
      then: yup.string().required()
    }),

  postalCode: yup
    .string()
    .required()
});

export const bankAccountValidationSchema = yup.object({
  name: yup
    .string(),

  city: yup
    .string()
    .required(),

  country: yup
    .string()
    .required(),

  line1: yup
    .string(),

  line2: yup
    .string(),

  district: yup
    .string()
    .when('country', {
      is: isDistrictRequired,
      then: yup.string().required()
    })
});