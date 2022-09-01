import { CommonLink } from "@/shared/models";

export const parseLinksForSubmission = (links: CommonLink[]): CommonLink[] =>
  links
    .filter((link) => link.title && link.value)
    .map((link) =>
      link.value.startsWith("www.")
        ? {
            ...link,
            value: `https://${link.value}`,
          }
        : link
    );
