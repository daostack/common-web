import { EntityTypes, GovernanceActions } from "@/shared/constants";

export const DeleteContentTypes = {
  [EntityTypes.Discussion]: GovernanceActions.DELETE_DISCUSSION,
  [EntityTypes.DiscussionMessage]: GovernanceActions.DELETE_MESSAGE,
};
