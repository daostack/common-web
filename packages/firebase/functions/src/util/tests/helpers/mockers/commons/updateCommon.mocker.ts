import { ICommonEntity } from '@common/types';

jest.mock('../../../../../common/database/updateCommon', () => ({
  updateCommon: jest.fn()
    .mockImplementation((payment: ICommonEntity): Promise<ICommonEntity> => Promise.resolve(payment))
}));

jest.mock('../../../../../common/business/updateCommonBalance', () => ({
  updateCommonBalance: jest.fn()
}));