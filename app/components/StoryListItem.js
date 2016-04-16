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

    return (
      <li className={styles.storyItem} title={item.title} onClick={this.props.onClick}>
        <div className={styles.title}>{item.title}</div>
        <div className={styles.domain}>{item.domain}</div>
        <div className={styles.details}>{item.points} points by {item.user} {item.time_ago}</div>

        <div className={styles.commentCount}>{item.comments_count}</div>
      </li>
    )
  }
}
