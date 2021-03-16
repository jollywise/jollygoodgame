const PROJECT = {
  title: '',
  manifestName: 'webpackmanifest',
  vendorName: 'vendor',
  generateHTML: true,
  generateSourcemaps: true,
  isHashed: true,
  dropConsole: false,
  isVendorChunked: true,
  environmentVars: {
    debug: true,
    debugBounds: true,
    watch: false,
    shortcuts: true,
  },
  containerId: 'game-holder',
};

module.exports = PROJECT;
