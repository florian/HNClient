import React, { Component, PropTypes } from 'react'

import styles from './Poll.styl'

export default class Comments extends Component {
  static propTypes = {
    data: React.PropTypes.array.isRequired
  }

  render () {
    return <ul className={styles.container}>
      {this.props.data.map(this.renderPollOption, this)}
    </ul>
  }

  renderPollOption ({ item, points }, i) {
    const percentage = points / this.totalVotes()

    return <li className={styles.option} key={i}>
      <div className={styles.item}>
        <span className={styles.label} dangerouslySetInnerHTML={{__html: item}} />
        <span className={styles.stats}>({points} votes)</span>
      </div>

      <div className={styles.share} style={{ width: `${percentage * 100}%` }}>{Math.round(percentage * 100)}%</div>
    </li>
  }

  totalVotes () {
    if (this.totalVotesCalculated) return this.totalVotesCalculated

    const poll = this.props.data
    const res = poll.map((v, i) => v.points).reduce((a, b) => a + b)
    this.totalVotesCalculated = res
    return res
  }
}
