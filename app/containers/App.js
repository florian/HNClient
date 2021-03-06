import React, { Component } from 'react'
import styles from './App.styl'

import key from 'keymaster'

import StoryList from '../components/StoryList'
import Comments from './Comments'
import Website from './Website'
import Resizer from '../components/Resizer'
import KeyboardShortcutInfo from '../components/KeyboardShortcutInfo'

export default class App extends Component {
  componentDidMount () {
    this.props.fetch()
    this.props.cleanupReadStories()
    key('k', 'all', this.props.selectPrevious)
    key('j', 'all', this.props.selectNext)
    key('l', 'all', this.props.cycleDisplay)
    key('r', 'all', this.props.fetch)
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.stories.resource !== this.props.stories.resource) this.props.fetch()
  }

  componentWillUnmount () {
    key.unbind('k', 'all')
    key.unbind('j', 'all')
    key.unbind('l', 'all')
    key.unbind('r', 'all')
  }

  render () {
    const className = this.props.stories.resizing ? styles.resizing : ''

    return (
      <div className={className}>
        <StoryList
          data={this.props.stories.data}
          selected={this.props.stories.selected}
          changeSelection={this.props.changeSelection}
          onResourceChange={this.props.changeResource}
          resource={this.props.stories.resource}
          onDisplayChange={this.props.changeDisplay}
          display={this.props.stories.display}
          isSelfPost={this.isSelfPost()}
          loading={this.props.stories.loading}
          onReload={this.props.fetch}
          failed={this.props.stories.failed}
          onWaypoint={this.props.fetchSecond}
        />

        {this.renderChosen()}
        {this.renderDevTools()}

        <KeyboardShortcutInfo />
      </div>
    )
  }

  renderChosen () {
    const item = this.getChosen()
    if (!item) return false

    var { display, websiteWidth } = this.props.stories
    if (this.isSelfPost()) display = 'comments'

    return <div>
      <Website item={item}
        width={display === 'link' ? 100 : websiteWidth}
        show={display !== 'comments'} />

      <Resizer onResize={this.onResize.bind(this)}
        onResizeEnd={this.props.disableResizing}
        width={websiteWidth}
        show={display === 'both'} />

      <Comments id={item.id}
        width={display === 'comments' ? 100 : 100 - websiteWidth}
        show={display !== 'link'} />
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

  getChosen () {
    if (this.props.stories.selected !== undefined) return this.props.stories.data[this.props.stories.selected]
    else return false
  }

  isSelfPost () {
    var chosen = this.getChosen()

    if (chosen) return !chosen.domain
    else return false
  }

  // Returns true or false indicating if the resize was accepted
  onResize (px) {
    this.props.enableResizing()

    const remaining = window.innerWidth - 401
    const absolute = this.props.stories.websiteWidth / 100 * remaining + px
    const percent = absolute / remaining * 100

    if (absolute > 300 && remaining - absolute > 350) {
      this.props.setWebsiteWidth(percent)
      return true
    } else {
      return false
    }
  }
}
