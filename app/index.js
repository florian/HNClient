import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Router, hashHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import './app.global.styl'

import App from './containers/App'

render(
  <App />,
  document.getElementById('root')
)
