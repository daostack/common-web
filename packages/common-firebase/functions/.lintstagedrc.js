module.exports = {
  '**/*.js?(x)': (filenames) => `eslint ${filenames.join(' ')}`
}
