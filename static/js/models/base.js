class BaseModel {// eslint-disable-line no-unused-vars
  constructor (collectionName) {
    this.collectionName = collectionName
    this.fields = ['id']
  }
  /**
   * @returns {Number}
   */
  getNextId (collection) {
    //return collection.length + 1
    let maxId = 0;
  collection.forEach((item) => {
    if (item.id > maxId) {
      maxId = item.id;
    }
  });
  return maxId + 1;
  }
  /**
   * @returns {Object}
   */
  GetEmpty () {
    const entry = {}

    this.fields.forEach(element => {
      entry[element] = null
    })

    return entry
  }
  /**
   * @returns {Array}
   */
  Select () {
    const stored = localStorage.getItem(this.collectionName)
    const collection = stored ? JSON.parse(stored) : []

    return collection
  }
  Commit (collection) {
    localStorage.setItem(this.collectionName, JSON.stringify(collection))
  }
  /**
   * @param {Number} id
   * @returns {BaseModel|undefined}
   */
  FindById (id) {
    return this.Select().find(item => item.id === id)
  }
  /**
   * @param {Number} id
   * @returns {Number}
   */
  FindIndexById (id) {
    return this.Select().findIndex(item => item.id === id)
  }

  Create (row) {
    const collection = this.Select()
    const entry = this.GetEmpty()

    entry.id = this.getNextId(collection)
    for (const key in row) {
      if (entry.hasOwnProperty(key) &&
          entry.key !== 'id') {
        entry[key] = row[key] 
      }
    }
    collection.push(entry)
    this.Commit(collection)
    const event = new CustomEvent(`${this.collectionName}ListDataChanged`, { detail: collection })
    document.dispatchEvent(event)
  }
  
  Delete (id) {
    const collection = this.Select()
    let findid = this.FindIndexById(id)
    collection.splice(findid, 1);
    this.Commit(collection);
    const event = new CustomEvent(`${this.collectionName}ListDataChanged`, { detail: collection })
    document.dispatchEvent(event)
  }
  
  Edit(id, data) {
    const collection = this.Select()
    const index = this.FindIndexById(id)
  
    if (index >= 0) {
      const entry = collection[index] 
  
      for (const key in data) {
        if (entry.hasOwnProperty(key) && key !== 'id') {
          entry[key] = data[key]
        }
      }
  
      collection[index] = entry
  
      this.Commit(collection)
      const event = new CustomEvent(`${this.collectionName}ListDataChanged`, { detail: collection })
      document.dispatchEvent(event)
    }
  }
}
