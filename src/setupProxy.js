const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/dwc',
    createProxyMiddleware({
      target: 'http://api.canair.io:8080',
      changeOrigin: true,
    })
  );
};