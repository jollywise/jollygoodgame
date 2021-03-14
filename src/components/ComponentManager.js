/**
 * @description Manages available components
 */

export const ComponentManager = {};

/**
 *
 * @param {Phaser.Game} game The Phaser game instance to install the Components
 * @param {Object} [userconfig] The user config for component options
 * @param {Object} [usermap] A custom component map to plugin alongside the defaults
 * @description Installs the Components, ensuring mandatory Components are installed while allowing for overrides by user
 *
 */
ComponentManager.InstallGameComponents = (game, userconfig = {}, componentMap = {}) => {
  Object.keys(componentMap).forEach((key) => {
    const componentConfig = componentMap[key];
    const userOptions = userconfig[key];

    // component is optional and user does not want it
    if (componentConfig.optional && !userOptions) return;

    // set component defaults
    let componentClass = componentConfig.component;
    let componentData = componentConfig.data;

    if (userOptions) {
      // check user options
      const { component, data } = userOptions;

      // user has supplied a component class inside a config object, return user class
      if (
        userOptions.component &&
        userOptions.component.prototype instanceof Phaser.Plugins.BasePlugin
      ) {
        componentClass = component;
        componentData = data || componentConfig;
      }

      // user has supplied a component class as the value, return user class
      if (userOptions.prototype instanceof Phaser.Plugins.BasePlugin) {
        componentClass = userOptions;
      }
    }

    const sceneKey = componentConfig.sceneKey ? key : false;
    const gameKey = componentConfig.gameKey ? key : false;
    const installed = game.plugins.install(key, componentClass, true, sceneKey, componentData);
    if (gameKey) game[key] = installed;
    console.log('\tinstalled component : ' + key);
  });
};
