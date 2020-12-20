const postCssImport = require('postcss-import')
const presetEnv = require('postcss-preset-env')

module.exports = {
  plugins: [
    postCssImport,
    presetEnv({
      features: {
        'nesting-rules': true
      }
    })
  ]
}
