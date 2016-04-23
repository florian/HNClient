import { createStore, applyMiddleware, compose } from 'redux'
import { persistStore, autoRehydrate } from 'redux-persist'
import thunk from 'redux-thunk'
import rootReducer from '../reducers'

var enhancer

if (localStorage.getItem('reduxPersist:stories') != null) {
  enhancer = compose(
    autoRehydrate(),
    applyMiddleware(thunk)
  )
} else {
  enhancer = applyMiddleware(thunk)
}

export default function configureStore (initialState) {
  const store = createStore(rootReducer, initialState, enhancer)
  persistStore(store, { whitelist: [ 'stories' ] })
  return store
}
