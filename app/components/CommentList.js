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
      <div className={styles.about} onClick={this.toggleFolded.bind(this)}>
        <span className={styles.username} title={userURL} onClick={this.openURL.bind(this, userURL)}>{data.user}</span>
        <span className={styles.time}>{data.time_ago}</span>
        <span className={styles.aboutChildren}>{this.getFoldedLabel()}</span>
      </div>

      <div className={styles.content} dangerouslySetInnerHTML={{__html: data.content}} />
      <div className={styles.children}>
        {data.comments.map(this.renderChild, this)}
      </div>
    </div>
  }

  renderChild (item) {
    return <CommentList data={item} key={item.id} />
  }

  openURL (url) {
    shell.openExternal(url)
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
