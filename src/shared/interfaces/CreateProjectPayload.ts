import {
  BaseRule,
  CommonLink,
  NotionIntegrationPayload,
  NotionIntegrationPayloadIntermediate,
  Roles,
  SpaceAdvancedSettings,
} from "@/shared/models";
import { TextEditorValue } from "@/shared/ui-kit";
import { SpaceAdvancedSettingsIntermediate } from "../models/SpaceAdvancedSettings";
import { UploadFile } from "./UploadFile";

export interface CreateProjectPayload {
  name: string;
  byline?: string;
  description?: string;
  image: string;
  links?: CommonLink[];
  unstructuredRules?: BaseRule[];
  gallery?: CommonLink[];
  video?: CommonLink;
  tags?: string[];
  highestCircleId: string;
  notion?: NotionIntegrationPayload;
  advancedSettings?: SpaceAdvancedSettings;
}

export interface IntermediateCreateProjectPayload {
  projectImages: UploadFile[];
  spaceName: string;
  byline: string;
  description: TextEditorValue;
  videoUrl: string;
  gallery: UploadFile[];
  links?: CommonLink[];
  roles?: Roles;
  advancedSettings?: SpaceAdvancedSettingsIntermediate;
  initialAdvancedSettings?: SpaceAdvancedSettingsIntermediate;
  highestCircleId: string;
  notion?: NotionIntegrationPayloadIntermediate;
}
