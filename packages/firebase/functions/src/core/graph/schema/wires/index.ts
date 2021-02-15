import { WireType } from './types/Wire.type';
import { WireBankType } from './types/WireBank.type';
import { WireBillingDetailsType } from './types/WireBillingDetails';
import { GetWiresQuery } from './queries/getWires.query';

export const WireTypes = [
  WireType,
  WireBankType,
  WireBillingDetailsType,

  GetWiresQuery
]