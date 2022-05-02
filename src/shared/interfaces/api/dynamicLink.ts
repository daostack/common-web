export interface DynamicLinkInfo {
  domainUriPrefix: string;
  link: string;
  socialMetaTagInfo?: {
    socialTitle: string;
    socialDescription: string;
    socialImageLink: string;
  };
}

export interface DynamicLinkResponse {
  shortLink: string;
  previewLink: string;
}
