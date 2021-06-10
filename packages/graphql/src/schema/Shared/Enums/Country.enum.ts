import { Country } from '@prisma/client';
import { enumType } from 'nexus';

export const CountryEnum = enumType({
  name: 'Country',
  members: Country
});