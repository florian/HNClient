import axios from 'axios'

const baseurl = 'http://159.203.152.155/hn/api'
const version = 'v1'

export function getStories (resource, onSuccess, onError) {
  axios.get(`${baseurl}/${version}/${resource}`).then(onSuccess).catch(onError)
}

export function getComments (id, onSuccess, onError) {
  axios.get(`${baseurl}/${version}/item/${id}`).then(onSuccess).catch(onError)
}
