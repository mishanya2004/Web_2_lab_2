class Dock extends BaseModel { // eslint-disable-line no-unused-vars, no-undef
  constructor () {
    super('docks')
    this.fields = this.fields.concat(['port', 'capacity'])
  }
}
