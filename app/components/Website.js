import React, { Component } from 'react'
import styles from './Website.styl'

export default class StoryList extends Component {
  static propTypes = {
    item: React.PropTypes.object.isRequired
  }

  render () {
    const item = this.props.item
    const style = { width: `calc((100% - 400px) * ${this.props.width} / 100)` }

    return <div className={styles.websiteContainer} style={style}>
      <h2 className="header itemHeader">{item.title}</h2>
      <div className={styles.webviewContainer}><webview src={item.url} autoSize="on"></webview></div>
    </div>
  }
}
