class AppUrlsPlugin extends Phaser.Plugins.BasePlugin {
  constructor(pluginManager) {
    super(pluginManager);

    this.basePath = './';
    this.assetsPath = 'assets/';
  }

  init(config) {
    config = config || {};
    this.basePath = config.base || this.basePath;
    this.assetsPath = config.assets || this._assetsPath;
  }

  setPaths(value = {}) {
    this.basePath = value.base || this.basePath;
    this.assetsPath = value.assets || this._assetsPath;
  }

  // get main directory
  getBaseDirectory() {
    return this.basePath;
  }

  // resolves relativly given url
  resolveRelativeUrl(path) {
    return this.getBaseDirectory() + path;
  }

  resolveLevelAssetsUrl(level, suffix) {
    return this.resolveRelativeUrl('assets/levels/' + level + '/') + suffix;
  }

  // get the root of the assets folder, pass in relative url for extended path
  getAssetsDirectory(urlSuffix) {
    return urlSuffix
      ? this.resolveRelativeUrl(this.assetsPath + urlSuffix)
      : this.resolveRelativeUrl(this.assetsPath);
  }

  // get the url to a game assets folder based on minigameid
  getGameAssetsDirectory(gameId, urlSuffix) {
    return urlSuffix
      ? this.resolveRelativeUrl(this.assetsPath + 'games/' + gameId + '/' + urlSuffix)
      : this.resolveRelativeUrl(this.assetsPath + 'games/' + gameId + '/');
  }

  getFontsDirectory(urlSuffix) {
    return this.getAssetsDirectory('fonts/' + urlSuffix);
  }
}

export { AppUrlsPlugin };
