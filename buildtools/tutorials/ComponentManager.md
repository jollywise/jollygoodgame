## summary

JollyGoodGame is built on a component system, providing access to a wide variety of pre-installed components.  
Core components are mandatory and as such cannot be disabled, but can be extended and overwritten if needed.  
Other components will only be included on request.

## core components

- copy
- settings
- soundController
- captions

## optional components

- vibrate
- gamehud

## enabling optional components

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

It should then be added to either the CORE or OPTIONAL arrays of the component map.

<pre>
{
    component: NewComponentClass,
    key: 'new_component_key',  
    gameKey: true, 
    sceneKey: true,
}</pre>

- component : The Component Class to install
- key : The key to use when adding to Phsers Plugin Manager
- gamekey : Optional, if true the key will be added to game scope
- sceneKey : Optional, if true the key will be added to scene scope

## extending the component map

JollyGoodGame has its own default component map that it will check component options against.

How-ever, if you are extending JollyGoodGame for a new framework base ( eg/ PBS/BBC ), you can include a component map specific to the new framework.

To do this, create a component map that follows the same structure as the base one, and pass that through along with your component configuration when extending AppBase.

The game will merge your new component map into it's default base one, and so all components will become available.

<pre>
const componentMap = {
  CORE : [], // an array of core components using the above configuration
  OPTIONAL : [] // an array of optional components using the above configuration
}
</pre>
