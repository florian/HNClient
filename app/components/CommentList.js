import React, { Component } from 'react'
import styles from './CommentList.styl'

import {shell} from 'electron'

export default class CommentList extends Component {
  static propTypes = {
    data: React.PropTypes.object.isRequired
  }

  constructor (props, context) {
    super(props, context)

    this.state = {
      folded: false
    }
  }

  render () {
    const data = this.props.data
    const userURL = `https://news.ycombinator.com/user?id=${data.user}`

    const foldedClass = this.state.folded ? styles.folded : ""
    const className = `${styles.comment} ${foldedClass}`

    return <div className={className}>
      <div className={styles.contentWrapper}>
        <div className={styles.about} onClick={this.toggleFolded.bind(this)}>
          <span className={styles.username} title={userURL} onClick={this.onUserClick}>{data.user}</span>
          <span className={styles.time}>{data.time_ago}</span>
          <span className={styles.aboutChildren}>{this.getFoldedLabel()}</span>
          <i className={`fa fa-reply ${styles.reply}`} aria-hidden="true" onClick={this.openReply.bind(this)}></i>
        </div>

        {this.renderContent()}
    </div>

    <div className={styles.children}>
      {data.comments.map(this.renderChild, this)}
    </div>
    </div>
  }

  renderContent () {
    const content = this.props.data.content

    if (content !== "[deleted]") {
      return <div className={styles.content} dangerouslySetInnerHTML={{__html: content}} />
    } else {
      return <div className={`${styles.content} ${styles.deletedContent}`}>
        This comment was deleted.
      </div>
    }
  }

  renderChild (item) {
    return <CommentList data={item} topId={this.props.topId} key={item.id} />
  }

  onUserClick (e) {
    const url = e.target.title
    shell.openExternal(url)

    e.preventDefault()
    e.stopPropagation()
  }

  openReply (e) {
    shell.openExternal(`https://news.ycombinator.com/reply?id=${this.props.data.id}&goto=item%3Fid%3D${this.props.topId}`)

    e.preventDefault()
    e.stopPropagation()
  }

  toggleFolded () {
    this.setState({ folded: !this.state.folded })
  }

  getFoldedLabel () {
    const count = this.getSubCommentsCount(this.props.data.comments)
    var foldedLabel = ""

    if (count > 0) {
      const comments = count === 1 ? "comment" : "comments"
      foldedLabel = `– ${count} child ${comments} hidden`
    }

    return foldedLabel
  }

  // this.props.data.comments.length only gets the size of the next level of
  // children, this recursively goes through all levels
  getSubCommentsCount (comments) {
    if (comments.length === 0) return 0

    var count = 0
    var nextComments = []

    comments.forEach((v, i) => {
      count++
      nextComments = nextComments.concat(v.comments)
    })

    return count + this.getSubCommentsCount(nextComments)
  }
}
