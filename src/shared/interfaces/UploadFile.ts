export interface UploadFile {
  // id can be any string. it is just for correct displaying purposes
  id: string;
  title: string;
  file: File | string;
  size?: number;
  name?: string;
}
