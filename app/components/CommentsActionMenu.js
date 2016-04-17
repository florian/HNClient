import React, { Component } from 'react'
import styles from './ActionMenu.styl'

import {shell, clipboard} from 'electron'

export default class CommentsActionMenu extends Component {
  static propTypes = {
    item: React.PropTypes.object.isRequired
  }

  render () {
    return <div className={`${styles.container} unimportantHeaderElement`}>
      <i data-tip data-for="external-comments-link"
        className="fa fa-external-link"
        onClick={this.openExternal.bind(this)}
      />

      <i data-tip data-for="commments-clipboard"
        className="fa fa-clipboard"
        onClick={this.copy.bind(this)}
      />
    </div>
  }

  openExternal (e) {
    const url = `https://news.ycombinator.com/item?id=${this.props.item.id}`
    shell.openExternal(url)
  }

  copy (e) {
    const url = `https://news.ycombinator.com/item?id=${this.props.item.id}`
    clipboard.writeText(url)
  }
}
