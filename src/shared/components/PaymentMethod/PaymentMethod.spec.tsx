import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { Card, CARD_BRANDS } from "@/shared/models";
import PaymentMethod from "./PaymentMethod";

describe("PaymentMethod", () => {
  const card: Card = {
    id: "226824ea-ee06-4ea0-b665-0d13ceb0d3fd",
    createdAt: new Date(),
    updatedAt: new Date(),
    token: "BUYER163-9324952R-UVYJFPHB-WBZTSNJC",
    provider: "PAYME",
    ownerId: "aO59rUvan4e27LzkqiAv5lAvZaX2",
    fullName: "Test Name",
    metadata: {
      network: CARD_BRANDS.VISA,
      digits: "1234",
      expiration: "1122",
    },
  };

  it("should call replace method handler", () => {
    const spy = jest.fn();
    render(<PaymentMethod card={card} onReplacePaymentMethod={spy} />);

    fireEvent.click(screen.getByText(/Replace payment method?/i));
    expect(spy).toBeCalledTimes(1);
  });
});
