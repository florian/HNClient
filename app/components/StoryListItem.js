import React, { Component } from 'react'
import styles from './StoryListItem.styl'
import { markStoryAsRead } from '../actions/stories'

export default class StoryListItem extends Component {
  static propTypes = {
    item: React.PropTypes.object.isRequired,
    isSelected: React.PropTypes.bool.isRequired,
    onClick: React.PropTypes.func
  }

  static contextTypes = {
    store: React.PropTypes.object
  }

  componentDidMount () {
    this.markReadIfSelected()
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.isSelected !== this.props.isSelected) this.markReadIfSelected()
    if (this.props.isSelected && !prevProps.isSelected) this.refs.container.scrollIntoViewIfNeeded(false)
  }

  render () {
    const item = this.props.item
    const { stories } = this.context.store.getState()

    var className = styles.storyItem
    if (this.props.isSelected) className += ' ' + styles.selected
    if (!item.domain) className += ' ' + styles.selfPost
    if (this.props.item.id in stories.readStories || this.props.isSelected) className += ' ' + styles.alreadyRead

    return (
      <li className={className} ref='container' onClick={this.props.onClick}>
        <div className={styles.title} title={item.title}>{item.title}</div>
        <div className={styles.domain}>{item.domain}</div>
        <div className={styles.details}>{item.points} points by {item.user} {item.time_ago}</div>

        <div className={styles.commentCount}>{item.comments_count}</div>
      </li>
    )
  }

  markReadIfSelected () {
    if (this.props.isSelected) this.markRead()
  }

  markRead () {
    this.context.store.dispatch(markStoryAsRead(this.props.item.id))
  }
}
