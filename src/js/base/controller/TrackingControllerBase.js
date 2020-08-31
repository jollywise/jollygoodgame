export class TrackingControllerBase {
  constructor({ game }) {
    this.game = game;
    this._plugin = null;
  }

  get plugin() {
    return this._plugin;
  }
  set plugin(plugin) {
    this._plugin = plugin;
  }

  track(data) {
    if (this._plugin) {
      this._plugin.track(data);
    } else {
      console.log('Unhandled track event', data);
    }
  }

  setPage(data) {
    if (this._plugin) {
      this._plugin.setPage(data);
    } else {
      console.log('Unhandled setPage event', data);
    }
  }
}
