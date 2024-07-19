module.exports = {
    testEnvironment: 'jest-environment-jsdom',
    setupFilesAfterEnv: ['<rootDir>/.jest/setup-tests.js'],
    moduleNameMapper: {
      '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/.jest/mocks/fileMock.js',
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    },
    transform: {
      '^.+\\.jsx?$': 'babel-jest',
      '^.+\\.mjs$': 'babel-jest',
    },
    transformIgnorePatterns: [
      '/node_modules/(?!react-datepicker|@babel/runtime)',
    ],
  };