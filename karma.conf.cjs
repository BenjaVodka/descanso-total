module.exports = function (config) {
  config.set({
    frameworks: ['jasmine'],
    files: [{ pattern: 'src/**/*.spec.jsx' }],
    preprocessors: {
      'src/**/*.spec.jsx': ['webpack'],
    },
    webpack: {
      mode: 'development',
      devtool: 'inline-source-map',
      resolve: { extensions: ['.js', '.jsx'] },
      module: {
        rules: [
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                babelrc: false,
                presets: [
                  ['@babel/preset-env', { targets: { esmodules: true } }],
                  ['@babel/preset-react', { runtime: 'automatic' }],
                ],
                plugins: ['istanbul'],
              },
            },
          },
        ],
      },
    },
    reporters: ['progress', 'coverage'],
    coverageReporter: {
      dir: 'coverage',
      reporters: [
        { type: 'text-summary' },
        { type: 'html', subdir: 'html' },
        { type: 'lcovonly', subdir: '.' },
      ],
    },
    browsers: ['jsdom'],
    singleRun: true,
    restartOnFileChange: false,
  })
}
