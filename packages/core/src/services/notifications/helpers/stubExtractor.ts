export const stubExtractor = (...content: string[]): string[] => {
  const stubs = [];

  for (const string of content) {
    const useful = string.split('{{');

    for (const stringWithStub of useful.filter((s) => s.includes('}}'))) {
      const stub = stringWithStub.split('}}')[0];

      stubs.push(stub);
    }
  }

  return Array.from(new Set(stubs));
};