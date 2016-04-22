import { createStore, applyMiddleware, compose } from 'redux'
import { persistStore, autoRehydrate } from 'redux-persist'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import rootReducer from '../reducers'
import DevTools from '../containers/DevTools'

const logger = createLogger({
  level: 'info',
  collapsed: true
})

const enhancer = compose(
  autoRehydrate(),
  applyMiddleware(thunk, logger),
  DevTools.instrument()
)

export default function configureStore (initialState) {
  const store = createStore(rootReducer, initialState, enhancer)

  if (module.hot) {
    module.hot.accept('../reducers', () =>
      store.replaceReducer(require('../reducers'))
    )
  }

  persistStore(store, { whitelist: [ 'stories' ] })

  return store
}
