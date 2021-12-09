export interface PaymentPageCreationData {
  sale_price: number;
  product_name: string;
  capture_buyer: number;
  currency: "ILS";
  commonId: string;
  installments: number;
  userId: string;
  proposalId: string;
}

export interface PaymentPageCreationResponse {
  url: string;
}
