import { IPaymentEntity } from '../../../../../circlepay/payments/types';

jest.mock('../../../../../circlepay/payments/database/updatePayment', () => ({
  updatePaymentInDatabase: jest.fn()
    .mockImplementation((payment: IPaymentEntity): Promise<IPaymentEntity> => Promise.resolve(payment))
}));