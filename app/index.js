import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import configureStore from './store/configureStore'

import './app.global.styl'
import App from './containers/App'
import AppPage from './containers/AppPage'

const store = configureStore()

render(
  <Provider store={store}>
    <AppPage />
  </Provider>,
  document.getElementById('root')
)
