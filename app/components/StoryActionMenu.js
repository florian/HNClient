import React, { Component } from 'react'
import styles from './StoryActionMenu.styl'

import Tooltip from 'react-tooltip'

import {shell, clipboard} from 'electron'

export default class StoryActionMenu extends Component {
  static propTypes = {
    onGoogle: React.PropTypes.func.isRequired,
    onReadability: React.PropTypes.func.isRequired,
    item: React.PropTypes.object.isRequired
  }

  render () {
    return <div className={`${styles.container} unimportantHeaderElement`}>
      <i data-tip data-for="external-link"
        className="fa fa-external-link"
        onClick={this.openExternal.bind(this)}
      />

      <i data-tip data-for="clipboard"
        className="fa fa-clipboard"
        onClick={this.copy.bind(this)}
      />

      <i data-tip data-for="readablity"
        className="fa fa-book"
        onClick={this.props.onReadability}
      />

      <i data-tip data-for="google"
        className="fa fa-google"
        onClick={this.props.onGoogle}
      />
    </div>
  }

  openExternal (e) {
    shell.openExternal(this.props.item.url)
  }

  copy (e) {
    clipboard.writeText(this.props.item.url)
  }
}
