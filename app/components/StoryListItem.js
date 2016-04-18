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

    return (
      <li className={className} onClick={this.props.onClick}>
        <div className={styles.title} title={item.title}>{item.title}</div>
        <div className={styles.domain}>{item.domain}</div>
        <div className={styles.details}>{item.points} points by {item.user} {item.time_ago}</div>

        <div className={styles.commentCount}>{item.comments_count}</div>
      </li>
    )
  }
}
