import axios from 'axios'

class API {
  getStories (resource, onSuccess, onError) {
    axios.get(`https://node-hnapi.herokuapp.com/${resource}`).then(onSuccess).catch(onError)
  }
}

export default new API()
