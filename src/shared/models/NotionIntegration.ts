export interface NotionIntegration {
  databaseId: string;
  token: string;
}

export interface NotionIntegrationIntermediate extends NotionIntegration {
  isEnabled: boolean;
}
