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

    // `!this.props.show` is true if only the comments will be displayed. However in that case we still
    // want to render the Website with width 0. If we only hide it then the
    // WebView won't properly rerender if we go from displaying website+comments
    // to only the comments to only the website to website+comments.
    // We render it at all to make sure the website is preloaded.
    if (!this.props.show) style.width = 0

    return <div className={styles.websiteContainer} style={style}>
      <h2 className="header itemHeader">{item.title}</h2>
      <div className={styles.webviewContainer}>
        <webview src={item.url} />
      </div>
    </div>
  }
}
