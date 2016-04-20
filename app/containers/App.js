import React, { Component, PropTypes } from 'react'
import axios from 'axios'
import styles from './App.styl'

import key from 'keymaster'

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
      loadedSecond: false, // Was the second top stories page loaded?
      selected: undefined,
      websiteWidth: 60, // in percent
      display: "both" // both, link, comments
    }
  }

  componentDidMount () {
    this.fetch()
    key("k", this.selectPrev.bind(this))
    key("j", this.selectNext.bind(this))
    key("l", this.cycleDisplay.bind(this))
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevState.resource !== this.state.resource) this.fetch()
  }

  componentWillUnmount () {
    key.unbind("k")
    key.unbind("j")
    key.unbind("l")
  }

  render() {
    const className = this.state.resizing ? styles.resizing : ""

    return (
      <div className={className}>
        <StoryList
          data={this.state.data}
          selected={this.state.selected}
          changeSelection={this.changeSelection.bind(this)}
          onResourceChange={this.changeResource.bind(this)}
          resource={this.state.resource}
          onDisplayChange={this.onDisplayChange.bind(this)}
          display={this.state.display}
          isSelfPost={this.isSelfPost()}
          loading={this.state.loading}
          onReload={this.fetch.bind(this)}
          failed={this.state.failed}
          onWaypoint={this.fetchSecond.bind(this)}
        />

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
    if (!item) return false

    var display = this.state.display
    if (this.isSelfPost()) display = "comments"

    return <div>
      <Website item={item}
        width={display === "link" ? 100 : this.state.websiteWidth}
        show={display !== "comments"} />

      <Resizer onResize={this.onResize.bind(this)}
        onResizeEnd={this.onResizeEnd.bind(this)}
        width={this.state.websiteWidth}
        show={display === "both"} />

      <Comments id={item.id}
        width={display === "comments" ? 100 : 100 - this.state.websiteWidth}
        show={display !== "link"} />
    </div>
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

  selectPrev () {
    const selected = Math.max(this.state.selected - 1, 0)
    this.setState({ selected })
  }

  selectNext () {
    const selected = Math.min(this.state.selected + 1, this.state.data.length - 1)
    this.setState({ selected })
  }

  changeResource (key) {
    this.setState({ resource: key })
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

  onDisplayChange (display) {
    this.setState({ display })
  }

  cycleDisplay () {
    const current = this.state.display
    var display

    if (current == "both") display = "link"
    else if (current == "link") display = "comments"
    else if (current == "comments") display = "link"

    this.setState({ display })
  }

  fetch () {
    this.setState({ loading: true, failed: false })

    // axios.get(`https://node-hnapi.herokuapp.com/${this.state.resource}`).then(response => {
    axios.get(`https://node-hnapi.herokuapp.com/best`).then(response => {
      this.setState({ data: response.data, loading: false, selected: 0, loadedSecond: false })
    }).catch(response => {
      this.setState({ failed: true, loading: false })
    })
  }

  fetchSecond () {
    if (this.state.resource !== "news" || this.state.loadedSecond) return false

    this.setState({ loading: true, failed: false, loadedSecond: true })

    axios.get(`https://node-hnapi.herokuapp.com/news2`).then(response => {
      this.setState({ data: this.state.data.concat(response.data), loading: false })
    }).catch(response => {
      this.setState({ failed: true, loading: false })
    })
  }

  isSelfPost () {
    var chosen = this.getChosen()

    if (chosen) return !chosen.domain
    else return false
  }
}
