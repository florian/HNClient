import React, { Component, PropTypes } from 'react'
import axios from 'axios'
import styles from './App.styl'

import StoryList from '../components/StoryList'
import Comments from './Comments'
import Website from '../components/Website'

export default class App extends Component {
  constructor (props, context) {
    super(props, context)

    this.state = {
      loading: true,
      failed: false,
      resource: "news",
      data: [],
      selected: undefined
    }
  }

  componentDidMount () {
    this.fetch()
  }

  componentDidUpdate (prevProps) {
    if (prevProps.resource !== this.props.resource) this.fetch()
  }

  render() {
    console.log("rendering")
    return (
      <div>
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
        <Website item={item} />
        <Comments id={item.id} />
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

  fetch () {
    this.setState({ loading: true, failed: false })

    axios.get('http://localhost:1339/news').then(response => {
      this.setState({ data: response.data, loading: false })
    }).catch(response => {
      this.setState({ failed: true, loading: false })
    })
  }
}
