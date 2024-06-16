class Ship extends BaseModel { // eslint-disable-line no-unused-vars, no-undef
  constructor () {
    super('ships')
    this.fields = this.fields.concat(['name', 'country', 'tonnage'])
  }
}
