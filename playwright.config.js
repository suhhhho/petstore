// Playwright configuration for API-only testing
module.exports = {
  testDir: './tests',
  timeout: 30000,
  expect: {
    timeout: 5000
  },
  use: {
    baseURL: 'https://petstore.swagger.io/v2',
    extraHTTPHeaders: {
      Accept: 'application/json'
    }
  },
  reporter: [['list'], ['html', { open: 'never' }]]
};
