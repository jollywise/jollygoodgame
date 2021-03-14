## summary

The system is built up of components that are installed via Phasers plugin system.  
Allowing the components to be scoped at game and scene levels if desired.

The Component system provides a wide variety of pre-built components ready for use, all of which can be extended to provide any custom behaviour needed in framework extensions and games.

The components are split into **_core_** and **_optional_** components.

## core components

Core components are required, and as such cannot be disabled.

This is so that the base framework can guarantee certain functionality.

How-ever, you can overwrite the default component by extended it and adding your extended version via the component map options as well as provide a custom config.

## optional components

Optional components will only be enabled on request.

These are generally top level features to provide some easy tools to use when developing games.

You can overwrite the default component by extended it and adding your extended version via the component map options as well as provide a custom config.

While the base JGG framework may have these flagged as optional, an extended framework can configure it's own ComponentMap to force them at that level.

## component map options

When initializing AppBase, you can pass through a Component Map with the configuration requirements needed for that game or framework.

The AppBase will compare the options with the default Component Map and install the components a needed.

example component map config

<pre>
  {
    // enable component, using default class
    component_key : true,

    // force a previoulsy optional component to be required
    component_key : { required : true },

    // enable component, using custom class
    component_key : { component : CustomClass },

    // enable component, using custom config
    component_key : { config : {} },

    // enable component, using custom class and config
    component_key : { component : CustomClass, config : {} }
  }
</pre>

## creating new components

You can also create new components and add themto the Component Map.
It is recommended that this is only done on a framework level, and a framework should have it's own default map to check options against.

To add a new component - create a plugin extending either Phaser.Plugins.BasePlugin or Phaser.Plugins.ScenePlugin and add it to the map, be careful to use a unique component key.

Phasers plugin system can install plugins as global or scene plugins. Global plugins share their props accross the whole game, while scene plugins are specific to the scene.

The plugin will be installed as either global or scene based on what you extended.

example of component added to map

<pre>
{
  component_key : {

    // the component class to install
    component: ComponentClass,

    // add to game scope using key
    gameKey: true,

    // add to scene scope using key
    sceneKey: true,

    // flag as core component
    required : true
  }
}
</pre>
