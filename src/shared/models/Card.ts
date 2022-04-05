interface CardMetadata {
  /**
   * The network of the card.
   * better create enums
   */
  network: "VISA" | "MASTERCARD" | string;

  /**
   * The last 4 digits of the card. Useful for
   * card identification by the user
   */
  digits: string;

  /**
   * The date when the card will be out of date
   */
  expiration: string;
}

export interface Card {
  /**
   * The main identifier of the common
   */
  id: string;

  /**
   * The time that the entity
   * was created
   */
  createdAt: Date;

  /**
   * The last time that the entity
   * was modified
   */
  updatedAt: Date;

  /**
   * This is the token of the card. When creating
   * charge request we should pass this token to the provider
   */
  token: string;

  /**
   * The payment provider we'll use to charge the card
   */
  provider: string;

  /**
   * This is the ID of the user, who created the card
   */
  ownerId: string;

  /**
   * This is the full name of the car owner.
   */
  fullName: string;

  /**
   * Some metadata, useful for the UI
   */
  metadata: CardMetadata;
}
