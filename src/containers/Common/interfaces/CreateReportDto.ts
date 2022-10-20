import { ENTITY_TYPES } from "@/shared/constants";

interface ModerationData {
  reasons: string;
  moderatorNote: string;
  itemId: string;
}

export interface CreateReportDto {
  moderationData: ModerationData;
  userId: string;
  type: ENTITY_TYPES;
}