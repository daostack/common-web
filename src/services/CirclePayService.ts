import axios from "axios";

import {
  IMembershipRequestData,
  IProposalPayload,
} from "../containers/Common/components/CommonDetailContainer/MembershipRequestModal/MembershipRequestModal";
import firebase from "../shared/utils/firebase";
import config from "../config";

const openpgpModule = import(
  /* webpackChunkName: "openpgp,  webpackPrefetch: true" */ "openpgp"
);

const endpoints = {
  assignCard: config.cloudFunctionUrl + "/circlepay/assign-card",
  encription: config.cloudFunctionUrl + "/circlepay/encryption",
  createCard: config.cloudFunctionUrl + "/circlepay/create-card",
  createJoin: config.cloudFunctionUrl + "/proposals/create/join",
};

const axiosClient = axios.create({
  timeout: 1000000,
});

// TODO: the Circle API should be via env var or something
const getEncryptedData = async (token: any, dataToEncrypt: any) => {
  const { data } = await axiosClient.get(endpoints.encription, {
    headers: {
      Authorization: await firebase.auth().currentUser?.getIdToken(true),
    },
  });
  const { keyId, publicKey } = data.data;
  const decodedPublicKey = atob(publicKey);

  const openpgp = await openpgpModule;

  const options = {
    message: openpgp.message.fromText(JSON.stringify(dataToEncrypt)),
    publicKeys: (await openpgp.key.readArmored(decodedPublicKey)).keys,
  };

  return await openpgp.encrypt(options).then((ciphertext: any) => ({
    encryptedData: btoa(ciphertext.data),
    keyId: keyId,
  }));
};

const cardData = (formData: IMembershipRequestData) => ({
  billingDetails: {
    name: formData.fullname,
    city: formData.city,
    country: formData.country,
    line1: formData.address,
    postalCode: formData.postal,
    district: formData.district,
  },
  expMonth: +formData.expiration_date.split("-")[1],
  expYear: +formData.expiration_date.split("-")[0],
});

export const createCard = async (formData: IMembershipRequestData) =>
  (
    await axiosClient.post(
      endpoints.createCard,
      await createCardPayload(formData),
      {
        headers: {
          Authorization: await firebase.auth().currentUser?.getIdToken(true),
        },
      }
    )
  ).data;

export const createRequestToJoin = async (formData: IProposalPayload) => {
  return await axiosClient.post(endpoints.createJoin, formData, {
    headers: {
      Authorization: await firebase.auth().currentUser?.getIdToken(true),
    },
  });
};

export const createCardPayload = async (formData: IMembershipRequestData) => {
  const token = await firebase.auth().currentUser?.getIdToken(true);
  try {
    const { encryptedData, keyId } = await getEncryptedData(token, {
      number: `${formData.card_number}`,
      cvv: `${formData.cvv}`,
    });

    console.log({
      keyId,
      encryptedData,
      ...cardData(formData),
    });

    return {
      keyId,
      encryptedData,
      ...cardData(formData),
    };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
};
