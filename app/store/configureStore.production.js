import { createStore, applyMiddleware, compose } from 'redux'
import { persistStore, autoRehydrate } from 'redux-persist'
import thunk from 'redux-thunk'
import rootReducer from '../reducers'

const enhancer = compose(
  autoRehydrate(),
  applyMiddleware(thunk)
)

export default function configureStore(initialState) {
  const store = createStore(rootReducer, initialState, enhancer)
  persistStore(store, { whitelist: [ 'stories' ] })
  return store
}
