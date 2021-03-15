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

Once configured, add the component config to your App config using the key **_components_**, and pass through in the constructor.super() call as normal.

<pre>

const App extends AppBase {

  constructor( { ...usualprops, components } ){

    super( { ...usualprops, components })
  }

}

</pre>

**Framework Component Map**

If configuring a component map for a frame-work base, you should merge this is with the optional component config before calling super.
This will ensure the default framework components remain configured, while still provoding the game the same level of configuration.

A handy method has been created to assist with this.

[MergeComponentMaps](global.html#MergeComponentMaps) will take the default map, and the configure map and merge them in ensuring everything remains configured as needed at the frame-work level.

<pre>
const FrameWorkApp extends AppBase {

  constructor( { ...usualprops, components } ){

    components = MergeComponentMaps(FrameworkComponentMap, components);

    super( { ...usualprops, components })
  }

}
</pre>

## creating new components

You can also create new components and add themto the Component Map.

It is recommended that this is only done on a framework level, and a framework should have it's own default map to check options against.

To add a new component - create a plugin extending either [Phaser.Plugins.BasePlugin](https://photonstorm.github.io/phaser3-docs/Phaser.Plugins.BasePlugin.html) or [Phaser.Plugins.ScenePlugin](https://photonstorm.github.io/phaser3-docs/Phaser.Plugins.ScenePlugin.html) and add it to the map, be careful to use a unique component key.

The game will automatically detect which type of plugin is extended and install them accordingly as game components.

<pre>
{
  component_key : {

    // the component class to install
    component: ComponentClass,

    // add to game scope using key
    gameKey: true,

    // add to scene scope using key ( global plugins only )
    sceneKey: true,

    // flag as core component ( global plugins only )
    required : true
  }
}
</pre>

You can still create and install Phaser Plugins via the standard way, and is reccomended to do so with any bespoke plugins being added at the game level.
