import { WireType } from './type/Wire.type';
import { WireBankAccountType } from './type/WireBankAccount.type';

import { CreateWireMutation } from './mutations/CreateWire.mutation';
import { CreateWireBankAccountMutation } from './mutations/CreateWireBankAccount.mutation';

import { WireWhereInput } from './Inputs/WireWhere.input';
import { GetWiresQuery } from './Queries/GetWires.query';

import { WireUserExtension } from './Extensions/WireUser.extension';

export const WireTypes = [
  WireType,
  WireBankAccountType,

  CreateWireMutation,
  CreateWireBankAccountMutation,

  WireWhereInput,
  GetWiresQuery,

  WireUserExtension
];