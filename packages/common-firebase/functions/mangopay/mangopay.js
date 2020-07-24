const { env } = require('../env')
const { mangoPayApi } = require('../settings');
const axios = require('axios');

const options = {
  auth: { username: env.mangopay.clientId, password: env.mangopay.apiKey },
  headers: {
    'Content-Type': 'application/json',
  },
};

/*

FirstName string REQUIRED
The name of the user

LastName string REQUIRED
The last name of the user

Birthday timestamp REQUIRED
The date of birth of the user - be careful to set the right timezone (should be UTC) to avoid 00h becoming 23h (and hence interpreted as the day before)

Nationality CountryIso REQUIRED
The user’s nationality. ISO 3166-1 alpha-2 format is expected

CountryOfResidence CountryIso REQUIRED
The user’s country of residence. ISO 3166-1 alpha-2 format is expected

Email string REQUIRED
The person's email address (not more than 12 consecutive numbers) - must be a valid email

*/

const createUser = async (userData) => {
  const userObject = {
    FirstName: 'FakeFirstName',
    LastName: userData.displayName,
    Email: userData.email,
    Birthday: -258443002, // can be fake and hadcoded
    Nationality: 'BG', // can be fake and hadcoded
    CountryOfResidence: 'BG', // can be fake and hadcoded
  };
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await axios.post(
      `${mangoPayApi}` + '/users/natural',
      userObject,
      options
    );
    return response.data;
  } catch (e) {
    throw e;
  }
};

const checkMangopayUserValidity = async (mangopayId) => {
  try {
    const response = await axios.get(`${mangoPayApi}` + `/users/${mangopayId}`, options);
    return !response.errors ? true : false;
  } catch (e) {
    console.log(e);
    throw e;
  }
}


/*

Owners list REQUIRED
An array of userIDs of who own's the wallet. For now, you only can set up a unique owner.

Description string REQUIRED
A desciption of the wallet

Currency CurrencyIso REQUIRED
The currency - should be ISO_4217 format

Tag string OPTIONAL
Custom data that you can add to this item

*/

const createWallet = async (mangopayId) => {
  const walletData = {
    Owners: [mangopayId],
    Description: 'A very cool wallet',
    Currency: 'EUR',
    Tag: 'Cloud function create a wallet',
  };
  try {
    const response = await axios.post(
      `${mangoPayApi}` + '/wallets',
      walletData,
      options
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

/*

UserId string REQUIRED
The object owner's UserId

Currency CurrencyIso REQUIRED
The currency - should be ISO_4217 format

CardType CardType OPTIONAL
The type of card . The card type is optional, but the default parameter is "CB_VISA_MASTERCARD" .

*/

const getCardRegistrationObject = async (userData) => {
  const userCardData = {
    UserId: userData.mangopayId,
    Currency: 'USD',
  };
  try {
    const response = await axios.post(
      `${mangoPayApi}` + '/CardRegistrations',
      userCardData,
      options
    );
    return response.data;
  } catch (e) {
    console.log('Error while getting Card Registration Object', e);
    throw e;
  }
}

const finalizeCardReg = async (cardRegistrationResult, Id) => {
  try {
    const { data: { CardId, Status, ResultMessage } } = await axios.put(
      `${mangoPayApi}` + `/cardregistrations/${Id}`,
      { RegistrationData: cardRegistrationResult.data },
      options
    );
    if (Status === 'ERROR') {
      throw new Error(ResultMessage);
    }
    return CardId;
  } catch (e) {
    console.log(e);
    throw (e);
  }
  
}

/* 

AuthorId string REQUIRED
A user's ID

DebitedFunds Money REQUIRED
Information about the funds that are being debited

CardId string REQUIRED

SecureModeReturnURL string REQUIRED

 */

const preauthorizePayment = async ({ funding, userData }) => {
  try {
    const preAuthData = {
      AuthorId: userData.mangopayId,
      DebitedFunds: {
        Currency: 'USD',
        Amount: funding,
      },
      CardId: userData.mangopayCardId,
      SecureModeReturnURL: 'https://common.io',
    };

    const preAuthReqData = await axios.post(
      `${mangoPayApi}` + '/preauthorizations/card/direct',
      preAuthData,
      options
    );

    console.log('PRE AUTH DATA', preAuthReqData.data);
    return preAuthReqData.data;
  } catch (e) {
    console.log('ERROR in CARD PREAUTHORIZATION', e);
    throw new Error(`Error with card pre-authorization, ${e}`);
  }
};

const cancelPreauthorizedPayment = async (preAuthId) => {
  try {
    const cancelData = {
      PaymentStatus: 'CANCELED',
    };

    const preAuthReqData = await axios.put(
      `${mangoPayApi}` + `/preauthorizations/${preAuthId}/`,
      cancelData,
      options
    );

    console.log('PRE AUTH DATA', preAuthReqData.data);
    return preAuthReqData.data;
  } catch (e) {
    console.log(e);
  }
};

const viewPreauthorization = async (preAuthId) => {
  try {
    const { data } = await axios.get(
      `${mangoPayApi}` + `/preauthorizations/${preAuthId}/`,
      options
    );
    return data;
  } catch (e) {
    console.log(e);
    throw (e);
  }
};

/*

AuthorId string REQUIRED
A user's ID

CreditedUserId string OPTIONAL
The user ID who is credited (defaults to the owner of the wallet)

CreditedWalletId string REQUIRED
The ID of the wallet where money will be credited

DebitedFunds Money REQUIRED
Information about the funds that are being debited

Fees Money REQUIRED
Information about the fees that were taken by the client for this transaction (and were hence transferred to the Client's platform wallet)

SecureModeReturnURL string REQUIRED
This is the URL where users are automatically redirected after 3D secure validation (if activated)

CardId string REQUIRED
The ID of a card

SecureMode SecureMode OPTIONAL
The SecureMode corresponds to '3D secure' for CB Visa and MasterCard. This field lets you activate it manually. The field lets you activate it automatically with "DEFAULT" (Secured Mode will be activated from €50 or when MANGOPAY detects there is a higher risk ), "FORCE" (if you wish to specifically force the secured mode).

Billing Billing OPTIONAL
Contains every useful informations related to the user billing

StatementDescriptor string OPTIONAL
A custom description to appear on the user's bank statement. It can be up to 10 characters long, and can only include alphanumeric characters or spaces. See here for important info. Note that each bank handles this information differently, some show less or no information.

Culture CultureCode OPTIONAL
The language to use for the payment page - needs to be the ISO code of the language

Tag string OPTIONAL
Custom data that you can add to this item

*/

const payToDAOStackWallet = async ({ preAuthId, Amount, userData }) => {
  const PayInData = {
    AuthorId: userData.mangopayId,
    CreditedWalletId: env.mangopay.daoStackWalletId, // The DAOSTACK USD WALLET ID
    DebitedFunds: {
      Currency: 'USD',
      Amount: Amount,
    },
    Fees: {
      Currency: 'USD',
      Amount: 0,
    },
    PreauthorizationId: preAuthId,
  };

  try {
    const payInData = await axios.post(
      `${mangoPayApi}` + '/payins/preauthorized/direct/',
      PayInData,
      options
    );

    return payInData.data;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

module.exports = {
  createUser,
  createWallet,
  preauthorizePayment,
  cancelPreauthorizedPayment,
  viewPreauthorization,
  payToDAOStackWallet,
  checkMangopayUserValidity,
  getCardRegistrationObject,
  finalizeCardReg
};
