export interface IProposalEntity {
  /**
   * The main identifier of the common
   */
  id: string;

  proposerId: string;

  dao: string;

  description: {
    funding: number;
  }
}