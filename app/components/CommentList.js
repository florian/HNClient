import React, { Component } from 'react'
import styles from './CommentList.styl'

export default class CommentList extends Component {
  static propTypes = {
    data: React.PropTypes.object.isRequired
  }

  render () {
    const data = this.props.data

    return <div className={styles.comment}>
      <div className={styles.about}>
        <span className={styles.username}>{data.user}</span>
        <span className={styles.time}>{data.time_ago}</span>
      </div>
      <div className={styles.content} dangerouslySetInnerHTML={{__html: data.content}} />
      <div className={styles.children}>
        {data.comments.map(this.renderChild, this)}
      </div>
    </div>
  }

  renderChild (item) {
    return <CommentList data={item} />
  }
}
