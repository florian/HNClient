import React, { Component } from 'react'
import styles from './Website.styl'

export default class StoryList extends Component {
  static propTypes = {
    item: React.PropTypes.object.isRequired
  }

  render () {
    const item = this.props.item

    return <div className={styles.websiteContainer}>
      <h2 className="header itemHeader">{item.title}</h2>
      <div className={styles.webviewContainer}><webview src={item.url} autoSize="on"></webview></div>
    </div>
  }
}
