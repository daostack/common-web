export interface ICircleMetadata {
  /**
   * Email of the user
   */
  email: string;

  /**
   * Hash of the session identifier; typically of the end user.
   */
  sessionId: string;

  /**
   * Single IPv4 or IPv6 address of user
   */
  ipAddress: string;
}