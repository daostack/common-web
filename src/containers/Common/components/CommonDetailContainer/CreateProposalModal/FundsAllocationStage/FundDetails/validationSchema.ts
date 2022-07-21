import * as yup from 'yup';

export const validationSchema = yup.object({
    commonBalance: yup.number(),
    amount: yup.number().transform(value => (isNaN(value) ? undefined : value)).max(yup.ref('commonBalance'), 'The amount requested cannot be greater than the Common balance.'),
    bankAccountDetails: yup.object().required(), 
});
