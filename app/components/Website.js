import React, { Component } from 'react'
import styles from './Website.styl'

import Tooltip from 'react-tooltip'

export default class StoryList extends Component {
  static propTypes = {
    item: React.PropTypes.object.isRequired,
    show: React.PropTypes.bool,
    width: React.PropTypes.number
  }

  static defaultProps = {
    show: true
  }

  constructor (props, context) {
    super(props, context)

    this.state = {
      canGoBack: false,
      canGoForward: false
    }
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
      <h2 className="header itemHeader">
        <div className={styles.navigation}>
          {this.renderBackButton()}
          {this.renderForwardButton()}
        </div>

        {item.title}
      </h2>

      <Tooltip place="bottom" type="dark" effect="solid" id="navigationGoBack">
        Go back to the previous website
      </Tooltip>

      <Tooltip place="bottom" type="dark" effect="solid" id="navigationGoForward">
        Go forward to the last website
      </Tooltip>

      <div className={styles.webviewContainer}>
        <webview
          src={item.url}
          ref="webview"
        />
      </div>
    </div>
  }

  componentDidMount () {
    this.refs.webview.addEventListener("did-start-loading", this.updateNavigation.bind(this))
    this.refs.webview.addEventListener("did-stop-loading", this.updateNavigation.bind(this))
  }

  componentWillUnmount () {
    this.refs.webview.removeEventListener("did-start-loading", this.updateNavigation.bind(this))
    this.refs.webview.addEventListener("did-stop-loading", this.updateNavigation.bind(this))
  }

  componentDidUpdate (prevProps, prevState) {
    // If the user chose a different story we want to clear the webview history
    if (prevProps.item.url !== this.props.item.url) this.refs.webview.clearHistory()
  }

  updateNavigation () {
    this.setState({
      canGoBack: this.refs.webview.canGoBack(),
      canGoForward: this.refs.webview.canGoForward()
    })
  }

  renderBackButton () {
    var className = "fa fa-caret-left"
    if (!this.state.canGoBack) className += " " + styles.disabledNavigation

    return <i className={className} data-tip data-for="navigationGoBack" onClick={() => this.refs.webview.goBack()} />
  }

  renderForwardButton () {
    var className = "fa fa-caret-right"
    if (!this.state.canGoForward) className += " " + styles.disabledNavigation

    return <i className={className} data-tip data-for="navigationGoForward" onClick={() => this.refs.webview.goForward()} />
  }
}
