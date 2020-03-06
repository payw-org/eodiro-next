const path = require('path')
const withSass = require('@zeit/next-sass')
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin')

module.exports = withSass({
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname, 'src')

    config.plugins.push(
      new FilterWarningsPlugin({
        exclude: /mini-css-extract-plugin[^]*Conflicting order between:/,
      })
    )

    return config
  },
  // devIndicators: {
  //   autoPrerender: false,
  // },
})
