import { v4 as uuidv4 } from "uuid";
import { UploadFile } from "@/shared/interfaces";
import { CommonLink } from "@/shared/models";

export const convertLinkToUploadFile = (link: CommonLink): UploadFile => ({
  id: uuidv4(),
  title: link.title,
  file: link.value,
});

export const convertLinksToUploadFiles = (links: CommonLink[]): UploadFile[] =>
  links.map((link) => convertLinkToUploadFile(link));
