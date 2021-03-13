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
  console.log('[Installing components]', userconfig);
  // instal mandatory Components
  componentMap.CORE.forEach((entry) => {
    // fetch user options from component configs
    let componentoptions = userconfig[entry.key] || {};
    // determine and install component
    const { component, config } = GetComponentToInstall(entry, componentoptions);
    const sceneKey = entry.sceneKey ? entry.key : false;
    const gameKey = entry.gameKey ? entry.key : false;
    const installed = game.plugins.install(entry.key, component, true, sceneKey, config);
    if (gameKey) game[entry.key] = installed;
    console.log('\tinstalled core component : ' + entry.key);
  });
  // instal optional Components
  componentMap.OPTIONAL.forEach((entry) => {
    // fetch user options from component configs
    let componentoptions = userconfig[entry.key];
    // determine and install component
    const { component, config } = GetComponentToInstall(entry, componentoptions, false);
    if (component) {
      const sceneKey = entry.sceneKey ? entry.key : false;
      const gameKey = entry.gameKey ? entry.key : false;
      const installed = game.plugins.install(entry.key, component, true, sceneKey, config);
      if (gameKey) game[entry.key] = installed;
      console.log('\tinstalled optional component : ' + entry.key);
    }
  });
};

/**
 *
 * @private
 * @param {Object} defaultconfig The default component config
 * @param {Object} userconfig The user config for the component
 * @param {bool=} mandatory Is a mandatory component, if set to false component will only be installed on user request
 * @returns {Object} The chosen component class and its config
 * @description Shared menthod to find the approrpriate component to install based on defaults and user options
 *
 */
const GetComponentToInstall = (defaultconfig, userconfig, mandatory = true) => {
  // component is not mandatory and user does not want it
  if (!mandatory && !userconfig) return { component: false };
  // component is either mandatory or requested
  const { component, config } = userconfig;
  // user has supplied a component class inside a config object, return user class
  if (component && component.prototype instanceof Phaser.Plugins.BasePlugin)
    return { component, config };
  // user has supplied a component class as the value, return user class
  if (userconfig.prototype instanceof Phaser.Plugins.BasePlugin) return { component: userconfig };
  // user has either supplied 'true' or nothing, return default
  return { component: defaultconfig.component, config: defaultconfig.config };
};

ComponentManager.MergeComponentMaps = (defaultMap, customMap) => {
  const map = {};
  Object.keys(defaultMap).forEach((key) => {
    if (customMap[key]) {
      map[key] = [...defaultMap[key], ...customMap[key]];
    } else {
      map[key] = [...defaultMap[key]];
    }
  });
  return map;
};
