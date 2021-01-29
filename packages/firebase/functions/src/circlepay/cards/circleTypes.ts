interface IBillingDetailsBase {
  city: string;
  country: string;
  line1: string;
  line2?: string;
  district?: string;
  postalCode: string;
}

export interface ICircleCreateBankAccountPayload {
  idempotencyKey: string;

  iban?: string;
  routingNumber?: string;
  accountNumber?: string;

  billingDetails: IBillingDetailsBase & {
    name: string;
  };

  bankAddress: IBillingDetailsBase & {
    bankName: string;
    line1?: string;
  }
}

export interface ICircleCreateBankAccountResponse {
 data: {
   id: string;
   description: string;
   trackingRef: string;
   fingerprint: string;
   billingDetails: IBillingDetailsBase & {
     name: string;
   };

   bankAddress: IBillingDetailsBase & {
     bankName: string;
     line1?: string;
   }
 }
}

export interface ICircleGetBankAccountResponse {
  data: {
    id: string;
    description: string;
    trackingRef: string;
    fingerprint: string;
    billingDetails: IBillingDetailsBase & {
      name: string;
    };

    bankAddress: IBillingDetailsBase & {
      bankName: string;
      line1?: string;
    }
  }
}

