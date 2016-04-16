import React, { Component, PropTypes } from 'react'
import axios from 'axios'
import styles from './Comments.styl'

import {shell} from 'electron'

import CommentList from '../components/CommentList'

export default class Comments extends Component {
  static propTypes = {
    id: React.PropTypes.number.isRequired
  }

  constructor (props, context) {
    super(props, context)

    this.state = {
      loading: true,
      failed: false,
      comments: []
    }
  }

  componentDidMount () {
    this.fetch()
  }

  componentDidUpdate (prevProps) {
    if (prevProps.id !== this.props.id) {
      this.fetch()
      this.refs.container.scrollTop = 0
    }
  }

  render () {
    const style = { width: `calc((100% - 400px) * ${this.props.width} / 100)` }

    return <div className={styles.commentContainer} style={style} ref="container">
      <h2 className="header commentHeader">{this.state.count} comments</h2>
      <div className={styles.commentList}>
        {this.renderReplyButton()}
        {this.state.comments.map(this.renderComment, this)}
      </div>
    </div>
  }

  renderComment (comment, i) {
    return <CommentList data={comment} topId={this.props.id} key={comment.id} />
  }

  renderReplyButton () {
    const isFirst = !this.state.loading && this.state.comments.length === 0

    return <div className={styles.pseudoTextarea} onClick={this.openCommentsUrl.bind(this)}>
      <p>Click here to open this story in the browser to reply…</p>
      {isFirst ? <p>You can be the first to start the discussion!</p> : ""}
    </div>
  }

  openCommentsUrl () {
    shell.openExternal(`https://news.ycombinator.com/item?id=${this.props.id}`)
  }

  fetch () {
    this.setState({ loading: true, failed: false })

    axios.get(`http://localhost:1339/item/${this.props.id}`).then(response => {
      this.setState({ comments: response.data.comments, count: response.data.comments_count, loading: false, failed: false })
    }).catch(response => {
      this.setState({ loading: false, failed: true })
    })
  }
}
