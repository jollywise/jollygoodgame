export class AppUrls {
  constructor(game, paths = { base: './', assets: 'assets/' }) {
    this.game = game;
    this.basePath = paths.base;
    this.assetsPath = paths.assets;
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
