class TextBox extends Phaser.GameObjects.Text {
  constructor(scene, { x, y, text, style, type = TextBox.COPY } = {}) {
    const fontstyle = { ...TextBox.STYLES[type], ...style };
    super(scene, x, y, text, fontstyle);
  }
}

export default TextBox;

TextBox.COPY = 'COPY';
TextBox.TITLE = 'TITLE';

TextBox.STYLES = {
  COPY: {
    fontFamily: 'Arial',
    fontSize: 26,
    color: '#000000',
  },
  TITLE: {
    fontFamily: 'Arial',
    fontSize: 52,
    color: '#000000',
  },
};
