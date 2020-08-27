class CopyModel {
  constructor({ xml }) {
    this.copy = {};
    const nodes = xml.getElementsByTagName('item');
    for (let i = 0; i < nodes.length; i++) {
      this.copy[nodes[i].getAttribute('id')] = nodes[i].childNodes[0].nodeValue;
    }
  }

  get(copyId, nodefault = true) {
    return nodefault ? this.getStringNoDefault(copyId) : this.getString(copyId);
  }

  getString(copyId) {
    return this.copy[copyId] || 'copy not found [ ' + copyId + ' ]';
  }

  getStringNoDefault(copyId) {
    if (!this.copy[copyId]) {
      console.warn('copy not found [ ' + copyId + ' ]');
    }
    return this.copy[copyId] || null;
  }
}
export default CopyModel;
