/**
 *
 * @alias components.CopyPlugin
 * @classdesc Manages in-game strings. Register a copy document ( xml or json ), and then you can use this for lookups within the game <br/><br/>
 * ***This is a mandatory jgg component, and so will be available to any game extending {@link AppBase}.*** <br> see {@link ComponentManager|Component Manager}
 *
 * <pre><code>
 * // access via scene
 * scene.copy
 *
 * // access via game
 * game.copy
 *
 * </code></pre>
 *
 */
class CopyPlugin extends Phaser.Plugins.BasePlugin {
  constructor(pluginManager) {
    super(pluginManager);
    this._copy = {};
  }

  init(config) {
    if (config instanceof XMLDocument) {
      this.addCopyFromXML(config);
    } else if (config) {
      this.addCopyFromJSON(config);
    }
  }

  /**
   * 
   * @param {XML} xml xml document containing copy
   * @description add copy from an xml object containing item elements
   * @example <caption>Example of expected xml structure.</caption> {@lang xml} 
      <data>
        <item id="title_welcome"><![CDATA[Game-Name]]></item>
        <item id="title_complete"><![CDATA[Game-Complete]]></item>
      </data>
   * 
   */
  addCopyFromXML(xml) {
    const nodes = xml.getElementsByTagName('item');
    for (let i = 0; i < nodes.length; i++) {
      this._copy[nodes[i].getAttribute('id')] = nodes[i].childNodes[0].nodeValue;
    }
  }

  /**
   * 
   * @param {JSON} json json object containing copy
   * @description add copy from a json object containing id/value pairs
   * @example <caption>Example of expected json structure.</caption> {@lang json} 
  
  {
    "title_welcome" : "Game-Name",
    "title_complete" : "Game-Complete"
  }

  */
  addCopyFromJSON(json) {
    Object.keys(json).forEach((key) => (this._copy[key] = json[key]));
  }

  /**
   *
   * @param {string} copyId ID of copy to fetch, as reference in supplied xml or json configuration
   * @returns {string} The paired copy if found, returns empty string if not.
   *
   */
  get(copyId) {
    if (!this._copy[copyId]) {
      console.warn('copy not found [ ' + copyId + ' ]');
    }
    return this._copy[copyId] || '';
  }

  destroy() {
    this._copy = null;
    super.destroy();
  }
}

export { CopyPlugin };
