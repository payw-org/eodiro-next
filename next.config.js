const path = require('path')
const withSass = require('@zeit/next-sass')

module.exports = withSass({
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname, 'src')
    return config
  },
})
