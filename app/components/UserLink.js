import React, { Component } from 'react'

import {shell} from 'electron'

export default class CommentList extends Component {
  static propTypes = {
    name: React.PropTypes.string,
    className: React.PropTypes.string
  }

  render () {
    if (!this.props.name) return false

    const userURL = this.getURL()
    return <span className={this.props.className}
      title={userURL}
      onClick={this.onClick.bind(this)}
    >{this.props.name}</span>
  }

  onClick (e) {
    shell.openExternal(this.getURL())

    e.preventDefault()
    e.stopPropagation()

  }

  getURL () {
    return `https://news.ycombinator.com/user?id=${this.props.name}`
  }
}
