// This model is reponsible for storing the IDs of all read stories for two weeks.
// These IDs are written to disk and IDs that are older than two weeks will be
// removed on startup.

import remote from 'remote'
const app = remote.require('app')

import fs from 'fs'
import touch from 'touch'

class ReadStories {

  constructor () {
    this.path = app.getPath('userData') + '/ids.txt'
    this.ensureFile()
    this.readFromDisk()
    this.removeObsolete()
  }

  ensureFile () {
    touch(this.path)
  }

  readFromDisk () {
    const str = fs.readFileSync(this.path).toString().trim()
    this.data = {}

    if (str !== '') {
      str.split('\n').forEach((v) => {
        const [id, time] = v.split(' ').map((s) => Number(s))
        this.data[id] = time
      })
    }
  }

  removeObsolete () {
    for (let id of Object.keys(this.data)) {
      const time = this.data[id]

      if (time < Date.now() - 2 * 7 * 24 * 60 * 60 * 1000) {
        delete this.data[id]
      }
    }

    this.writeToDisk()
  }

  writeToDisk () {
    var str = ''

    for (let id of Object.keys(this.data)) {
      const time = this.data[id]
      str += `${id} ${time}\n`
    }

    fs.writeFileSync(this.path, str, 'utf-8')
  }

  add (id) {
    const time = Date.now()
    this.data[id] = Date.now()
    fs.appendFileSync(this.path, `${id} ${time}\n`)
  }

  contains (id) {
    return id in this.data
  }
}

export default new ReadStories()
