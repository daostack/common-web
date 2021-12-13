export interface PaymentPageCreationBaseData {
  sale_price: number;
  product_name: string;
  currency: "ILS";
  user_id: string;
  transaction_id: string;
}

export interface PaymentPageCreationDataWithCharging extends PaymentPageCreationBaseData {
  sale_type: "charge";
  create_buyer_token: boolean;
}

export interface PaymentPageCreationDataWithoutCharging extends PaymentPageCreationBaseData {
  sale_type: "token";
}
