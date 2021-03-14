/**
 * @alias components.CaptionsPlugin
 * @classdesc Adds support for in game captions. Renders captions over the game within a dom element<br/><br/>
 * 
 * The dom element is styled following the below defaults
 * <pre><code> 
    fontSize: 24,
    fontFamily: 'sans-serif',
    color: 'white',
    background: 'black',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    bottom: 10,
    position: 'absolute',    
    left : 50%;
    transform : translateX(-50%)

 * </code></pre>
 * <br>
 * 
 * ***This is a mandatory jgg component, and so will be available to any game extending {@link AppBase}.*** <br> see {@link components.ComponentManager|Component Manager}
 * <pre><code>
 * // access via scene
 * scene.captions
 *
 * // access via game
 * game.captions
 *
 * </code></pre>
 *
 */
class CaptionsPlugin extends Phaser.Plugins.BasePlugin {
  constructor(pluginManager) {
    super(pluginManager);
    this._style = {
      fontSize: '24px',
      fontFamily: 'sans-serif',
      color: 'white',
      background: 'black',
      paddingTop: '5px',
      paddingBottom: '5px',
      paddingLeft: '10px',
      paddingRight: '10px',
      bottom: '10px',
      position: 'absolute',
      left: '50%',
      transform: 'translateX(-50%)',
    };
    this._timeout = false;
    this._enabled = false;
    this._captionsToShow = [];
    this._durationMin = 1500;
    this._durationMax = false;
    this._durationChar = 300;
  }

  init() {
    this._domElement = document.createElement('div');
    this._styleSubtitle();
  }

  /**
   * @description set the minimum duration that a caption will display for ( if no duration is supplied )
   * @default 1500
   */
  set durationMinimum(value) {
    this._durationMin = value;
  }

  /**
   * @description set the maximum duration that a caption will display for ( disabled by default )
   * @default false
   */
  set durationMaximum(value) {
    this._durationMax = value;
  }

  /**
   * @description set the duration for each character in the caption. <br>
   * If no duration is supplied the duration is calculated as ( value x caption.length )
   */
  set durationPerChar(value) {
    this._durationChar = value;
  }

  /**
   * Enable / Disable captions
   * @default false
   */
  set enabled(value) {
    this._enabled = value;
  }

  /**
   * @description set captions style, formatted in a css valid object 
   * @default see example
   * @example
   * 
      {
      fontSize: '24px',
      fontFamily: 'sans-serif',
      color: 'white',
      background: 'black',
      paddingTop: '5px',
      paddingBottom: '5px',
      paddingLeft: '10px',
      paddingRight: '10px',
      bottom: '10px',
      position: 'absolute',
    }
  */
  set style(value) {
    this._style = { ...this._style, ...value };
    this._styleSubtitle();
  }

  /**
   *  @description set caption font size
   *  @default 24
   */
  set fontSize(value) {
    this._style.fontSize = value + 'px';
    this._styleSubtitle();
  }

  /**
   * @description set caption font family
   * @default sans-serif
   */
  set fontFamily(value) {
    this._style.fontFamily = value;
    this._styleSubtitle();
  }

  /**
   *  @description set caption font colour
   *  @default white
   */
  set colour(value) {
    this._style.color = value;
    this._styleSubtitle();
  }

  /**
   *  @description set caption background colour
   *  @default black
   */
  set background(value) {
    this._style.background = value;
    this._styleSubtitle();
  }

  /** @description set caption background padding ( all sides ) */
  set padding(value) {
    this._style.paddingTop = value + 'px';
    this._style.paddingBottom = value + 'px';
    this._style.paddingLeft = value + 'px';
    this._style.paddingRight = value + 'px';
    this._styleSubtitle();
  }

  /**
   * @description set caption background top and bottom padding
   * @default 5
   */
  set paddingVertical(value) {
    this._style.paddingTop = value + 'px';
    this._style.paddingBottom = value + 'px';
    this._styleSubtitle();
  }

  /**
   * @description set caption background left and right padding
   * @default 10
   */
  set paddingHorizontal(value) {
    this._style.paddingLeft = value + 'px';
    this._style.paddingRight = value + 'px';
    this._styleSubtitle();
  }

  /**
   * @description set caption distance from screen edge
   * @default 10
   * */
  set scenePadding(value) {
    this._style.bottom = value + 'px';
    this._styleSubtitle();
  }

  /**
   * @description Show a caption for a defined amount of time. By default the duration will be calculated according to caption length
   * @param {string|Array} copy caption or captions to be displayed
   * @param {number} [duration] duration to show caption for
   * @example <caption>Example of the different way in which you can trigger captions</caption>
    
    // show a single caption using default duration
    scene.captions.show('caption string');

    // show an array of captions using default duration
    scene.captions.show(['caption one', 'caption two'])

    // show an array of captions with defined duration for each caption
    scene.captions.show([{copy : 'caption one', duration : 1000}, {copy : 'caption two', duration : 2500} ])

    // mix and match
    scene.captions.show([{copy : 'caption one', duration : 1000}, 'caption two',  {copy : 'caption three', duration : 2500} ])

  */
  show(copy, duration) {
    if (!this._enabled) return;
    clearTimeout(this._timeout);
    if (Array.isArray(copy)) {
      copy.forEach((entry) => {
        if (typeof entry === 'string') {
          this._captionsToShow.push({ copy: entry, duration });
        } else if (entry.hasOwnProperty('copy')) {
          this._captionsToShow.push({ copy: entry.copy, duration: entry.duration || duration });
        }
      });
    } else {
      this._captionsToShow.push({ copy, duration });
    }
    if (!this._timeout) {
      this._showNextCaption();
    }
  }

  /**
   * @description hide any active caption and clears the queue
   */
  hide() {
    this._clearCaptionTimeout();
    this.game.scale.parent.removeChild(this._domElement);
  }

  /** @private */
  _showNextCaption() {
    if (!this._enabled) {
      this.hide();
      return;
    }
    const caption = this._captionsToShow.shift();
    if (caption) {
      this._clearCaptionTimeout();
      const { copy, duration } = caption;
      this._domElement.innerHTML = copy;
      this.game.scale.parent.appendChild(this._domElement);

      let showDuration = duration || Math.min(this._durationMin, this._durationChar * copy.length);
      if (this._durationMax) {
        showDuration = Math.min(showDuration, this._durationMax);
      }

      this._timeout = setTimeout(this._showNextCaption.bind(this), showDuration);
    } else {
      this.hide();
    }
  }

  /** @private */
  _clearCaptionTimeout() {
    clearTimeout(this._timeout);
    this._timeout = null;
  }

  /** @private */
  _styleSubtitle() {
    Object.keys(this._style).forEach((key) => {
      this._domElement.style[key] = this._style[key];
    });
  }
}

export { CaptionsPlugin };
