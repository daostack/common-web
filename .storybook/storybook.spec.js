import initStoryshots, {
  multiSnapshotWithOptions,
} from "@storybook/addon-storyshots";

initStoryshots({
  test: multiSnapshotWithOptions(),
  storyKindRegex: /^((?!.*?TextEditor).)*$/,
});
