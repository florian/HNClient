import React, { Component, PropTypes } from 'react'
import axios from 'axios'
import styles from './Comments.styl'

import {shell} from 'electron'

import CommentList from '../components/CommentList'
import UserLink from '../components/UserLink'

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

  componentDidUpdate (prevProps) {
    if (prevProps.id !== this.props.id) {
      this.fetch()
      this.refs.container.scrollTop = 0
    }
  }

  render () {
    const style = { width: `calc((100% - 400px) * ${this.props.width} / 100)` }
    if (!this.props.show) style.display = "none"

    return <div className={styles.commentContainer} style={style} ref="container">
      <h2 className="header commentHeader">{this.getHeaderContent()}</h2>
      <div className={styles.commentList}>
        {this.renderContent()}
        {this.renderReplyButton()}
        {this.state.comments.map(this.renderComment, this)}
      </div>

      <Tooltip place="bottom" type="dark" effect="solid" id="OP">
        Original Poster – this user submitted the story
      </Tooltip>
    </div>
  }

  getHeaderContent () {
    var content = `${this.state.count} comments`
    if (this.props.width === 100) content = `${this.state.data.title} (${content})`
    return content
  }

  renderContent () {
    if (!this.state.data) return false
    const { content, user, time_ago } = this.state.data
    if (!content) return false

    return <div className={styles.selfPost}>
      <div className={styles.about}>
        <UserLink name={user} className={styles.user} />
        –
        <span className={styles.time_ago}>{time_ago}</span>
      </div>
      <div className={styles.content} dangerouslySetInnerHTML={{__html: content}}></div>
    </div>
  }

  renderReplyButton () {
    const isFirst = !this.state.loading && this.state.comments.length === 0

    return <div className={styles.pseudoTextarea} onClick={this.openCommentsUrl.bind(this)}>
      <p>Click here to open this story in the browser to reply…</p>
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
      this.setState({ comments: response.data.comments, count: response.data.comments_count, data: response.data, loading: false, failed: false })
    }).catch(response => {
      this.setState({ loading: false, failed: true })
    })
  }
}
