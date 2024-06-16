class ShipOnDock extends BaseModel { // eslint-disable-line no-unused-vars, no-undef
  constructor () {
    super('shipsondocks')
    this.fields = this.fields.concat(['dock', 'ship'])
  }
}
