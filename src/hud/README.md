## Hud

The Hud is a phaser scene that can be added as a global scene to sit over the top of your other game scenes, or initialized as a child of scenes.

```javascript
import { Hud } from '@jollywise/jollygoodgame';

this.sceneManager.add('Hud', Hud, true, hudconfig);
```

Set the hud state by passing through a state ID that matches a hud state defined in the HudConfig
The hud will then wipe the current state then parse the new state config, spawning buttons as required

```javascript
hud.setState('STATE_ID');
```

When a Hud button is intereacted with by the user, the hud will dispatch a BUTTON_SELECT event that the game controller can listen out for and react accordingly.

```javascript
hud.events.on('BUTTON_SELECT', manageButton);

const manageButton = (btnid) => {
  console.log('button selecetd ' + buttonid);
  // do what is needed
};
```

Alternatively, specific events can be added to the button configs and when detected the Hud will also dispatch the set string as an event whioch the game can then react to.

```javascript
const buttondata = {
  id: 'btn_pause',
  event: 'PAUSE_GAME',
};

hud.events.on('PAUSE_GAME', doSomething);
```

## HudButtonGroup

The HudButtonGroup manages groups of buttons, by controlling their layouts within the group and keeping the group anchored to the screen.

## HudConfig

A default configuration for the Hud that can be overwritten as needed.
This is a collection of general button data ( costumes, ids, group allocations ), scene configs ( what buttons to show when triggered and button group position data.
