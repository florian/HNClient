import axios from 'axios'

class API {
  getComments (id, onSuccess, onError) {
    axios.get(`https://node-hnapi.herokuapp.com/item/${id}`).then(onSuccess).catch(onError)
  }
}

export default new API()
