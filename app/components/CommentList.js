import React, { Component } from 'react'
import styles from './CommentList.styl'

import { shell, clipboard } from 'electron'
import key from 'keymaster'
import scrollIntoView from 'scroll-iv'

import UserLink from './UserLink.js'

export default class CommentList extends Component {
  static propTypes = {
    data: React.PropTypes.object.isRequired,
    topId: React.PropTypes.oneOfType([
        React.PropTypes.number,
        React.PropTypes.string
    ]).isRequired,
    OP: React.PropTypes.string.isRequired,
    selectedId: React.PropTypes.number,
    onFold: React.PropTypes.func.isRequired,
    onClick: React.PropTypes.func
  }

  constructor (props, context) {
    const noop = () =>
    props.onClick = props.onClick || noop

    super(props, context)

    this.state = {
      folded: false
    }
  }

  componentDidMount () {
    if (this.isSelected()) this.bindEnter()
  }

  componentWillUnmount() {
    if (this.isSelected()) this.unbindEnter()
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.isSelected()) scrollIntoView(this.refs.container)

    // If it just got selected
    if (prevProps.selectedId !== prevProps.data.id && this.isSelected()) this.bindEnter()

    // If it just lost selection
    if (prevProps.selectedId === prevProps.data.id && !this.isSelected()) this.unbindEnter()
  }

  render () {
    const data = this.props.data
    const foldedClass = this.state.folded ? styles.folded : ""
    var className = `${foldedClass}`

    const isSelected = this.isSelected()
    if (isSelected) className += " " + styles.selected

    return <div className={className} ref="container">
      <div className={styles.contentWrapper}>
        <div className={styles.about} onClick={this.toggleFolded.bind(this)}>
          <div className={styles.aboutItem}>
            <UserLink name={data.user} className={styles.username} />
            {data.user === this.props.OP ? this.renderOP() : ""}
            <span className={styles.time}>{data.time_ago}</span>
            <span className={styles.aboutChildren}>{this.getFoldedLabel()}</span>
          </div>

          <div className={styles.actions}>
            <i data-tip data-for="copy-sub-comment-link" className="fa fa-clipboard" onClick={this.copyLink.bind(this)}></i>
            <i data-tip data-for="open-reply-link" className="fa fa-reply" onClick={this.openReply.bind(this)}></i>
          </div>
        </div>

        {this.renderContent()}
    </div>

    <div className={styles.children}>
      {data.comments.map(this.renderChild, this)}
    </div>
    </div>
  }

  renderOP () {
    return <span
      className={styles.isOP}
      data-tip
      data-for="OP"
    >OP</span>
  }

  renderContent () {
    const content = this.props.data.content

    if (content !== "[deleted]") {
      return <div className={styles.content} dangerouslySetInnerHTML={{__html: content}} onClick={this.onContentClick.bind(this)} />
    } else {
      return <div className={`${styles.content} ${styles.deletedContent}`} onClick={this.onContentClick.bind(this)}>
        This comment was deleted.
      </div>
    }
  }

  renderChild (item) {
    return <CommentList
      key={item.id}
      data={item}
      topId={this.props.topId}
      selectedId={this.props.selectedId}
      OP={this.props.OP}
      onFold={this.props.onFold}
      onClick={this.props.onClick}
    />
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

  bindEnter () {
    key("enter", `comment-${this.props.data.id}`, this.toggleFolded.bind(this))
    key.setScope(`comment-${this.props.data.id}`)
  }

  unbindEnter () {
    key.unbind("enter", `comment-${this.props.data.id}`)
  }

  openReply (e) {
    shell.openExternal(`https://news.ycombinator.com/reply?id=${this.props.data.id}&goto=item%3Fid%3D${this.props.topId}`)

    e.preventDefault()
    e.stopPropagation()
  }

  copyLink (e) {
    clipboard.writeText(`https://news.ycombinator.com/item?id=${this.props.data.id}`)

    e.preventDefault()
    e.stopPropagation()
  }

  toggleFolded () {
    const folded = !this.state.folded
    this.setState({ folded })
    this.props.onFold(this.props.data.id, folded)
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

  onContentClick () {
    this.props.onClick(this.props.data.id)
  }

  isSelected () {
    return this.props.selectedId === this.props.data.id
  }
}
