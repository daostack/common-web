import { interfaceType } from 'nexus';

export const AddressInterface = interfaceType({
  resolveType: () => null,
  name: 'Address',
  definition(t) {
    t.string('line1');
    t.string('line2');

    t.nonNull.string('city');
    t.nonNull.string('country');
    t.nonNull.string('postalCode');
    t.string('district');
  }
});