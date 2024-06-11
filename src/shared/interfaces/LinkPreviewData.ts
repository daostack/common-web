export interface LinkPreviewData {
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
