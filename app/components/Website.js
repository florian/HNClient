import React, { Component } from 'react'
import styles from './Website.styl'

export default class StoryList extends Component {
  static propTypes = {
    item: React.PropTypes.object.isRequired,
    show: React.PropTypes.bool,
    width: React.PropTypes.number
  }

  static defaultProps = {
    show: true
  }

  render () {
    const item = this.props.item
    const style = { width: `calc((100% - 400px) * ${this.props.width} / 100)` }
    if (!this.props.show) style.display = "none"

    return <div className={styles.websiteContainer} style={style}>
      <h2 className="header itemHeader">{item.title}</h2>
      <div className={styles.webviewContainer}><webview src={item.url} autoSize="on"></webview></div>
    </div>
  }
}
