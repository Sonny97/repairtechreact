const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3002',
    viewportWidth: 1280,
    viewportHeight: 720,
  },
})