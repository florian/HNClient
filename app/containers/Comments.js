import React, { Component, PropTypes } from 'react'
import axios from 'axios'
import styles from './Comments.styl'

import {shell} from 'electron'
import deepEqual from 'deep-equal'

import CommentList from '../components/CommentList'
import UserLink from '../components/UserLink'
import CommentsActionMenu from '../components/CommentsActionMenu'
import Poll from '../components/Poll'

import Tooltip from 'react-tooltip'

export default class Comments extends Component {
  static propTypes = {
    // This is needed because the API sometimes returns a String as an ID
    id: React.PropTypes.oneOfType([
      React.PropTypes.number,
      React.PropTypes.string
    ]).isRequired,

    show: React.PropTypes.bool,
    width: React.PropTypes.number
  }

  static defaultProps = {
    show: true
  }

  constructor (props, context) {
    super(props, context)

    this.state = {
      loading: true,
      failed: false,
      comments: [],
      count: undefined,
      data: {}
    }
  }

  componentDidMount () {
    this.fetch()
  }

  componentDidUpdate (prevProps, prevState) {
    // We want to (re)fetch the comments if a new story was chosen (i.e. the ID
    // changed)
    if (prevProps.id !== this.props.id) {
      this.fetch()
      this.refs.container.scrollTop = 0
    }
  }

  render () {
    const style = { width: `calc((100% - 400px) * ${this.props.width} / 100)` }
    if (!this.props.show) style.display = "none"

    return <div className={styles.commentContainer} style={style} ref="container">
      <h2 className="header commentHeader">
        {this.getHeaderContent()}
        <CommentsActionMenu item={this.state.data} />
      </h2>

      {this.renderComments()}

      <Tooltip place="top" type="dark" effect="solid" id="OP">
        Original Poster – this user submitted the story
      </Tooltip>

      <Tooltip place="left" type="dark" effect="solid" id="external-comments-link">
        Open the link to all comments in an external browser
      </Tooltip>

      <Tooltip place="left" type="dark" effect="solid" id="commments-clipboard">
        Copy the link to all comments
      </Tooltip>

      <Tooltip place="left" type="dark" effect="solid" id="copy-sub-comment-link">
        Copy the direct link to this comment
      </Tooltip>

      <Tooltip place="left" type="dark" effect="solid" id="open-reply-link">
        Open the link to reply to this comment in an external browser
      </Tooltip>
    </div>
  }

  getHeaderContent () {
    if (this.state.loading) {
      return <span className={styles.loading}>
        <i className="fa fa-refresh fa-spin" />
        Loading comments…
      </span>
    }

    if (this.state.failed) {
      return <span className={styles.failed}>
        <i className="fa fa-exclamation-circle" />
        Couldn't load comments
      </span>
    }

    var content = `${this.state.count} comments`
    if (this.props.width === 100) content = `${this.state.data.title} (${content})`
    return content
  }

  renderComments () {
    if (this.state.loading || this.state.failed) return false

    return <div className={styles.commentList} onClick={this.commentClicked.bind(this)}>
      {this.renderContent()}
      {this.renderReplyButton()}
      {this.state.comments.map(this.renderComment, this)}
    </div>
  }

  renderContent () {
    if (!this.state.data) return false
    const { content, user, time_ago, type, title } = this.state.data

    if (!content && type !== "poll") return false

    const label = content || title.replace(/^Poll: /i, "")

    return <div className={styles.selfPost}>
      <div className={styles.about}>
        <UserLink name={user} className={styles.user} />
        –
        <span className={styles.time_ago}>{time_ago}</span>
      </div>

      <div className={styles.content} dangerouslySetInnerHTML={{__html: label}}></div>

      {this.renderPoll()}
    </div>
  }

  renderPoll () {
    if (this.state.data.type !== "poll") return false
    return <Poll data={this.state.data.poll} />
  }

  renderReplyButton () {
    const isFirst = !this.state.loading && this.state.comments.length === 0

    var label = "Click here to open this story in the browser to reply"
    if (this.state.data.type === "poll") label += " or to vote in the poll"
    label += "…"

    return <div className={styles.pseudoTextarea} onClick={this.openCommentsUrl.bind(this)}>
      <p>{label}</p>
      {isFirst ? <p>You can be the first to start the discussion!</p> : ""}
    </div>
  }

  renderComment (comment, i) {
    return <CommentList data={comment} topId={this.props.id} OP={this.state.data.user} key={comment.id} />
  }

  openCommentsUrl () {
    shell.openExternal(`https://news.ycombinator.com/item?id=${this.props.id}`)
  }

  fetch () {
    this.setState({ loading: true, failed: false })

    axios.get(`https://node-hnapi.herokuapp.com/item/${this.props.id}`).then(response => {
    // axios.get(`https://node-hnapi.herokuapp.com/item/126809`).then(response => {
      this.setState({ comments: response.data.comments, count: response.data.comments_count, data: response.data, loading: false, failed: false })
    }).catch(response => {
      this.setState({ loading: false, failed: true })
    })
  }

  commentClicked (e) {
    if (e.target.tagName.toLowerCase() === "a") {
      shell.openExternal(e.target.href)

      e.preventDefault()
      e.stopPropagation()
    }
  }
}
