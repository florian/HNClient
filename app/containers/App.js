import React, { Component, PropTypes } from 'react'
import axios from 'axios'
import styles from './App.styl'

import StoryList from '../components/StoryList'
import Comments from './Comments'
import Website from '../components/Website'
import Resizer from '../components/Resizer'

export default class App extends Component {
  constructor (props, context) {
    super(props, context)

    this.state = {
      loading: true,
      failed: false,
      resource: "news",
      data: [],
      selected: undefined,
      websiteWidth: 60 // in percent
    }
  }

  componentDidMount () {
    this.fetch()
  }

  componentDidUpdate (prevProps) {
    if (prevProps.resource !== this.props.resource) this.fetch()
  }

  render() {
    const className = this.state.resizing ? styles.resizing : ""

    return (
      <div className={className}>
        <StoryList data={this.state.data} selected={this.state.selected} changeSelection={this.changeSelection.bind(this)} />
        {this.renderChosen()}
        {this.renderDevTools()}
      </div>
    )
  }

  getChosen () {
    const state = this.state

    if (state.selected !== undefined) return state.data[state.selected]
    else return false
  }

  renderChosen () {
    const item = this.getChosen()

    if (item) {
      return <div>
        <Website item={item} width={this.state.websiteWidth} />
        <Resizer onResize={this.onResize.bind(this)} onResizeEnd={this.onResizeEnd.bind(this)} width={this.state.websiteWidth} />
        <Comments id={item.id} width={100 - this.state.websiteWidth} />
      </div>
    } else {
      return false
    }
  }

  renderDevTools () {
    if (process.env.NODE_ENV !== 'production') {
      const DevTools = require('./DevTools')
      return <DevTools />
    } else {
      return false
    }
  }

  changeSelection (i) {
    this.setState({ selected: i })
  }

  // Returns true or false indicating if the resize was accepted
  onResize (px) {
    this.setState({ resizing: true })

    const remaining = window.innerWidth - 401
    const absolute = this.state.websiteWidth / 100 * remaining + px
    const percent = absolute / remaining * 100

    if (absolute > 300 && remaining - absolute > 350) {
      this.setState({ websiteWidth: percent })
      return true
    } else {
      return false
    }
  }

  onResizeEnd () {
    this.setState({ resizing: false })
  }

  fetch () {
    this.setState({ loading: true, failed: false })

    axios.get('http://localhost:1339/news').then(response => {
      this.setState({ data: response.data, loading: false })
    }).catch(response => {
      this.setState({ failed: true, loading: false })
    })
  }
}
