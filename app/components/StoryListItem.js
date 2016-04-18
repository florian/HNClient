import readStories from '../store/ReadStories'

import React, { Component } from 'react'
import styles from './StoryListItem.styl'

export default class StoryListItem extends Component {
  static propTypes = {
    item: React.PropTypes.object.isRequired,
    isSelected: React.PropTypes.bool.isRequired,
    onClick: React.PropTypes.func
  }

  render() {
    const item = this.props.item

    var className = styles.storyItem
    if (this.props.isSelected) className += " " + styles.selected
    if (!item.domain) className += " " + styles.selfPost
    if (readStories.contains(this.props.item.id) || this.props.isSelected) className += " " + styles.alreadyRead

    return (
      <li className={className} ref="container" onClick={this.onClick.bind(this)}>
        <div className={styles.title} title={item.title}>{item.title}</div>
        <div className={styles.domain}>{item.domain}</div>
        <div className={styles.details}>{item.points} points by {item.user} {item.time_ago}</div>

        <div className={styles.commentCount}>{item.comments_count}</div>
      </li>
    )
  }

  componentDidMount () {
    this.markReadIfSelected()
  }

  componentDidUpdate () {
    this.markReadIfSelected()
    if (this.props.isSelected) this.refs.container.scrollIntoViewIfNeeded(false)
  }

  markReadIfSelected () {
    if (this.props.isSelected) this.markRead()
  }

  markRead () {
    readStories.add(this.props.item.id)
  }

  onClick () {
    this.props.onClick()
    this.markRead()
  }
}
