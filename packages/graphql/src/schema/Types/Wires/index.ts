import { WireType } from './type/Wire.type';
import { WireBankAccountType } from './type/WireBankAccount.type';

import { CreateWireMutation } from './mutations/CreateWire.mutation';
import { CreateWireBankAccountMutation } from './mutations/CreateWireBankAccount.mutation';

export const WireTypes = [
  WireType,
  WireBankAccountType,

  CreateWireMutation,
  CreateWireBankAccountMutation
];