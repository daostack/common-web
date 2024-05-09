export interface LinkPreviewDataResponse {
  title?: string;
  description?: string;
  image?: {
    height?: number;
    type?: string;
    url: string;
    width?: number;
    alt?: string;
  };
  url: string;
}

export interface LinkPreviewData
  extends Omit<LinkPreviewDataResponse, "image"> {
  image?: string;
}
