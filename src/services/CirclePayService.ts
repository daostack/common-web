import axios from "axios";

import { createApolloClient, tokenHandler } from "../shared/utils";
import { CIRCLE_PAY_URL, GRAPH_QL_URL } from "../shared/constants";
import { IMembershipRequestData } from "../containers/Common/components/CommonDetailContainer/MembershipRequestModal/MembershipRequestModal";
//import { CreateCardDocument } from "../graphql";

const openpgpModule = import(
  /* webpackChunkName: "openpgp,  webpackPrefetch: true" */ "openpgp"
);

const axiosClient = axios.create({
  baseURL: CIRCLE_PAY_URL,
  timeout: 1000000,
});

const apollo = createApolloClient(GRAPH_QL_URL || "", localStorage.token || "");

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

export const createCard = async (formData: IMembershipRequestData) => {
  try {
    const cardData = await createCardPayload(formData);
    //console.log(cardData);
    // return await apollo.mutate({
    //   mutation: CreateCardDocument,
    //   variables: {
    //     createCard: cardData,
    //   },
    // });
  } catch (err) {
    console.error("Error while trying to create a new Card");
    throw err;
  }
};

export const createCardPayload = async (formData: IMembershipRequestData) => {
  const token = tokenHandler.get();
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
    console.error(err);
  }
};
