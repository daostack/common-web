module.exports = {
  '**/*.{t,j}s?(x)': (filenames) => `eslint ${filenames.join(' ')}`
}
