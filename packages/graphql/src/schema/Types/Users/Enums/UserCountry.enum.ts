import { UserCountry } from '@prisma/client';
import { enumType } from 'nexus';

export const UserCountryEnum = enumType({
  name: 'UserCountry',
  members: UserCountry
});