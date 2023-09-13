import pluralize from "pluralize";

export const pluralizeWord = (word?: string) => {
  if (!word) {
    return "";
  }

  return pluralize.plural(word);
};
