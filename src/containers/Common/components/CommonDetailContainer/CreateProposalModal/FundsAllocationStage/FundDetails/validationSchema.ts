import * as yup from 'yup';
import { formatPrice } from '@/shared/utils';

export const validationSchema = yup.object({
    commonBalance: yup.number(),
    amount: yup.number().transform(value => (isNaN(value) ? undefined : value)).max(yup.ref('commonBalance'),
        ({ max }) => `The amount requested cannot be greater than the Common balance (${formatPrice(max, { shouldRemovePrefixFromZero: false })}).`),
    bankAccountDetails: yup.object().required(),
});
