import axios from "axios";
import { createApolloClient, tokenHandler } from "../shared/utils";
import { CIRCLE_PAY_URL, GRAPH_QL_URL } from "../shared/constants";
import { IMembershipRequestData } from "../containers/Common/components/CommonDetailContainer/MembershipRequestModal/MembershipRequestModal";
import { CreateCardDocument } from "../graphql";
const openpgp = require("openpgp");

var base64 = require("base-64");

const axiosClient = axios.create({
  baseURL: CIRCLE_PAY_URL,
  timeout: 1000000,
});

const apollo = createApolloClient(GRAPH_QL_URL || "", localStorage.token || "");

// TODO: replace with call to new backend when API is ready.
const getEncryptedData = async (token: any, dataToEncrypt: any) => {
  const { data } = await axiosClient.get("encryption/public", {
    headers: {
      Authorization:
        "Bearer QVBJX0tFWTpmNThkOGFkYmEyMWE5Y2FlMzI4MzkxYjJjNGVlNWFmYjphMGNiN2UyYTUwYzEzNzNmNTVjNjg5ODYxZDdmZTIxZQ",
    },
  });
  const { keyId, publicKey } = data.data;
  let decodedPublicKey = base64.decode(publicKey);
  console.log(decodedPublicKey);
  const messageToSend = await openpgp.createMessage({ text: JSON.stringify(dataToEncrypt) });
  console.log(messageToSend);
  return openpgp
    .encrypt({
      message: messageToSend,
      encryptionKeys: decodedPublicKey,
    })
    .then((ciphertext: any) => ({
      encryptedData: base64.encode(ciphertext),
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
  expMonth: +formData.expiration_date.split("/")[0],
  expYear: +`20${formData.expiration_date.split("/")[1]}`,
});

export const createCard = async (formData: IMembershipRequestData) => {
  try {
    const cardData = await createCardPayload(formData);
    console.log(cardData);
    return await apollo.mutate({
      mutation: CreateCardDocument,
      variables: {
        createCard: cardData,
      },
    });
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
    console.log(err);
  }
};
