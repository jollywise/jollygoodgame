export const InstallGameComponents = (game, componentMap) => {
  // nothing to install
  if (!componentMap) return;

  Object.keys(componentMap).forEach((key) => {
    const componentConfig = componentMap[key];

    // set component defaults
    let componentClass = componentConfig.component;
    let componentData = componentConfig.data;
    if(componentClass.prototype instanceof Phaser.Plugins.ScenePlugin){
      game.plugins.installScenePlugin(key, componentClass, key);
      console.log('\tinstalled component - scene - ' + key);
    } else  if(componentClass.prototype instanceof Phaser.Plugins.BasePlugin) {
      const sceneKey = componentConfig.sceneKey ? key : false;
      const gameKey = componentConfig.gameKey ? key : false;
      const installed = game.plugins.install(key, componentClass, true, sceneKey, componentData);
      if (gameKey) game[key] = installed;
      if (installed) console.log('\tinstalled component - global - ' + key);
    }
  });
};

export const MergeComponentMaps = (defaultMap, optionalMap) => {
  const mergedMap = {};
  Object.keys(defaultMap).forEach((key) => {
    const merged = MergeComponentConfig(defaultMap[key], optionalMap[key]);
    if (merged) mergedMap[key] = merged;
  });
  const additionalComponents = Object.keys(optionalMap).filter((k) => !mergedMap[k]);
  additionalComponents.forEach((key) => (mergedMap[key] = optionalMap[key]));
  console.log(mergedMap);
  return mergedMap;
};

export const MergeComponentConfig = (defaultConfig, optionalConfig) => {
  if(defaultConfig === true && !optionalConfig) return defaultConfig;
  // config is optional and user option does not want it
  if (!defaultConfig.required && !optionalConfig) return false;
  // user has requested default component and config
  if (optionalConfig === true) return defaultConfig;
  // component is not option, and user has ommited it - return default
  if (defaultConfig.required && !optionalConfig) return defaultConfig;
  // user has some custom configuration
  return  { ...defaultConfig, ...optionalConfig };
};
