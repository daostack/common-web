import { $circleClient } from '@circle/client';

export interface IGetEncryptionKey {
  data: {
    publicKey: string;
    keyId: string;
  };
}

export const _getEncryptionKey = async (): Promise<IGetEncryptionKey> => {
  const response = await $circleClient.get<IGetEncryptionKey>('/encryption/public');

  return response.data;
};