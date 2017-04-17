import axios from 'axios'

const baseurl = 'http://su.at:32100'

export function getStories (resource, onSuccess, onError) {
  axios.get(`${baseurl}/${resource}`).then(onSuccess).catch(onError)
}

export function getComments (id, onSuccess, onError) {
  axios.get(`${baseurl}/item/${id}`).then(onSuccess).catch(onError)
}
