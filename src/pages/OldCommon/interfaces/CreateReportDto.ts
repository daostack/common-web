import { EntityTypes } from "@/shared/constants";

interface ModerationData {
  reasons: string;
  moderatorNote: string;
  itemId: string;
}

export interface CreateReportDto {
  moderationData: ModerationData;
  userId: string;
  type: EntityTypes;
}
