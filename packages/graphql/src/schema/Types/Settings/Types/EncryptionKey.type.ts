import { objectType } from 'nexus';

export const EncryptionKeyType = objectType({
  name: 'EncryptionKey',
  definition(t) {
    t.nonNull.string('keyId');
    t.nonNull.string('publicKey');
  }
});