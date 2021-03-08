import { commonDb } from '../database';

/**
 * Whitelist common by it's ID. It does not broadcast `CommonWhitelistedEvent` as
 * there is trigger listening for this and that would cause double events.
 *
 * @param commonId - The ID of the common to whitelist
 */
export const whitelistCommon = async (commonId: string): Promise<void> => {
  // Find the common
  const common = await commonDb.get(commonId);

  // Change the state of whitelisting
  common.register = 'registered';

  // Save the changes
  await commonDb.update(common);
}