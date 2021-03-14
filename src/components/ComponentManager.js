/**
 * @alias components.ComponentManager
 * @class
 * @classdesc Installs components into the game instance, based on supplied map and options
 * 
 * ## summary

  JollyGoodGame is built on a component system, providing access to a wide variety of pre-installed components.  
  Core components are mandatory and as such cannot be disabled, but can be extended and overwritten if needed.  
  Other components will only be included on request.

  ## core components

  - {@link components.CopyPlugin|copy}
  - {@link components.SettingsPlugin|settings}
  - {@link components.SoundPlugin|soundController}
  - {@link components.CaptionsPlugin|captions}

  ## optional components

  - {@link components.VibratePlugin|vibrate}
  - {@link components.GameHudPlugin|gamehud}

  ## enabling components

  Core components will always be installed. How-ever, you can turn optional ones on as desired.

  <pre>
  const components = {
    gamehud : true,
    vibrate : true,
  }
  </pre>

  ## overwriting components

  You can overwrite any of the components.  
  To do so, extend the default component class and pass through the extended class instead.

  You can also include a config object that will be passed to the components init method when it is installed.

  <pre>
  const components = {
    settings : ExtendedSettingsClass,
    gamehud : { component : ExtendedGameHudClass, config : {} },
    vibrate : true,
  }
  </pre>

  ## adding new components

  Components are injected via the ComponentMap, which is used to define the core and optional components, along with their default classes to be used.

  A component should extend Phaser.Plugins.BasePlugin (https://photonstorm.github.io/phaser3-docs/Phaser.Plugins.BasePlugin.html)

  <pre>
  const component_config = {
      component: NewComponentClass,
      gameKey: true, 
      sceneKey: true,
      optional : false,
      config : {}
  }</pre>

  - component : The Component Class to install
  - key : The key to use when adding to Phsers Plugin Manager
  - gamekey : Optional, if true the key will be added to game scope
  - sceneKey : Optional, if true the key will be added to scene scope
  - optional : define if the plugin is a core component or can be turned off
  - config : any data to be passed through to component init method

  ## extending the component map

  JollyGoodGame has its own default component map that it will check component options against.

  How-ever, if you are extending JollyGoodGame for a new framework base ( eg/ PBS/BBC ), you can include a component map specific to the new framework.

  To do this, create a component map that follows the same structure as the base one, and pass that through along with your component configuration when extending AppBase.

  The game will merge your new component map into it's default base one, and so all components will become available.  


  <pre>
  const componentMap = {
    key : { ...component_config }
  }
  </pre>

  ***note that the default components will take priotity when merging maps, a component map should only be used to add additional components. Use the component config options to override a default one.**

  ## supplying component options and maps

  The App base is where the components are passed through.
  Append the options to the current arguements being passed through to the constructor

  <pre>
  new AppBase( { ..originaloptions, components, componentMap } )
  </pre>

 * 
 */

class ComponentManager {}

/**
 *
 * @param {Phaser.Game} game The Phaser game instance to install the Components
 * @param {Object} componentMap The component map to check against
 * @param {Object} [userconfig] The user config for component options
 * @description Installs the Components, ensuring mandatory Components are installed while allowing for overrides by user
 * 
 * @example <caption>example of userconfig</caption> 
  {
    // enable component, using default class
    gamehud : true, 
    // enable component, overriding with a custom class that extends the default
    settings : ExtendedSettingsClass,
    // enable component, overriding with a custom class, and pass a config to component init method
    captions : { component : ExtendedCaptionsClass, config : {} },
  }

* @example <caption>example of componentMap</caption> 
  {
   "component_key" :  {
      // the class to install as the component
      component: NewComponentClass, 
      // add the component to game scope using ( uses key )
      gameKey: true,               
      // add the component to scene scope using ( uses key ) 
      sceneKey: true,      
      // define component as option or a core component        
      optional : false             
    }
  }

 */
ComponentManager.InstallGameComponents = (game, componentMap, userconfig = {}) => {
  // nothing to install
  if (!componentMap) return;

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

export { ComponentManager };
