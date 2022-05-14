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

  it("should display all necessary data", () => {
    render(<PaymentMethod card={card} onReplacePaymentMethod={() => {}} />);

    expect(screen.getByText(card.fullName)).toBeInTheDocument();
    expect(
      screen.getByText(new RegExp(card.metadata.digits, "i"))
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        `${card.metadata.expiration.slice(
          0,
          2
        )}/${card.metadata.expiration.slice(2)}`
      )
    ).toBeInTheDocument();
  });

  it("should display specified title", () => {
    const title = "Title for component";
    render(
      <PaymentMethod
        card={card}
        title={title}
        onReplacePaymentMethod={() => {}}
      />
    );

    expect(screen.getByText(title)).toBeInTheDocument();
  });

  it("should call replace method handler", () => {
    const spy = jest.fn();
    render(<PaymentMethod card={card} onReplacePaymentMethod={spy} />);

    fireEvent.click(screen.getByText(/Replace payment method\?/i));
    expect(spy).toBeCalledTimes(1);
  });
});
