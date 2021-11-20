import axios from "axios";

import { CIRCLE_PAY_URL } from "../shared/constants";
import { IMembershipRequestData } from "../containers/Common/components/CommonDetailContainer/MembershipRequestModal/MembershipRequestModal";
import firebase from "../shared/utils/firebase";

const openpgpModule = import(
  /* webpackChunkName: "openpgp,  webpackPrefetch: true" */ "openpgp"
);

const endpoints = {
  assign:
    "https://us-central1-common-daostack.cloudfunctions.net/circlepay/assign-card",
  create:
    "https://us-central1-common-daostack.cloudfunctions.net/circlepay/create-card",
};

const axiosClient = axios.create({
  baseURL: CIRCLE_PAY_URL,
  timeout: 1000000,
});

// TODO: the Circle API should be via env var or something
const getEncryptedData = async (token: any, dataToEncrypt: any) => {
  const { data } = await axiosClient.get("encryption/public", {
    headers: {
      Authorization:
        "Bearer QVBJX0tFWTpmNThkOGFkYmEyMWE5Y2FlMzI4MzkxYjJjNGVlNWFmYjphMGNiN2UyYTUwYzEzNzNmNTVjNjg5ODYxZDdmZTIxZQ",
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
      endpoints.create,
      await createCardPayload(formData),
      {
        headers: {
          Authorization: await firebase.auth().currentUser?.getIdToken(true),
        },
      }
    )
  ).data;

export const createCardPayload = async (formData: IMembershipRequestData) => {
  const token = await firebase.auth().currentUser?.getIdToken(true);
  try {
    const { encryptedData, keyId } = await getEncryptedData(token, {
      number: `${formData.card_number}`,
      cvv: `${formData.cvv}`,
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
