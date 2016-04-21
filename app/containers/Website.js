import React, { Component } from 'react'
import styles from './Website.styl'

import Tooltip from 'react-tooltip'
import StoryActionMenu from '../components/StoryActionMenu'

const readabilityCode = "((function(){window.baseUrl='//www.readability.com';window.readabilityToken='';var s=document.createElement('script');s.setAttribute('type','text/javascript');s.setAttribute('charset','UTF-8');s.setAttribute('src',baseUrl+'/bookmarklet/read.js');document.documentElement.appendChild(s);})())"

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
      canGoForward: false,
      loading: false
    }
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


  render () {
    const item = this.props.item
    const style = { width: `calc((100% - 400px) * ${this.props.width} / 100)` }

    var className = styles.websiteContainer
    // `!this.props.show` is true if only the comments will be displayed. However in that case we still
    // want to render the Website with width 0. If we only hide it then the
    // WebView won't properly rerender if we go from displaying website+comments
    // to only the comments to only the website to website+comments.
    // We render it at all to make sure the website is preloaded. This is the
    // approach suggested in the Electron docs.
    if (!this.props.show) className += " " + styles.hidden

    return <div className={styles.websiteContainer} style={style}>
      <h2 className={`header itemHeader ${styles.header}`}>
        <div className={styles.navigation}>
          {this.renderBackButton()}
          {this.renderForwardButton()}
        </div>
        {this.renderLoadingButton()}

        <span className={styles.title}>{item.title}</span>

        <StoryActionMenu
          item={this.props.item}
          onGoogle={this.onGoogle.bind(this)}
          onReadability={this.onReadability.bind(this)}
        />
      </h2>

      <Tooltip place="bottom" type="dark" effect="solid" id="navigationGoBack">
        Go back to the previous website
      </Tooltip>

      <Tooltip place="bottom" type="dark" effect="solid" id="navigationGoForward">
        Go forward to the last website
      </Tooltip>

      <Tooltip place="bottom" type="dark" effect="solid" id="external-link">
        Open this link in an external browser
      </Tooltip>

      <Tooltip place="bottom" type="dark" effect="solid" id="clipboard">
        Copy this link to the clipboard
      </Tooltip>

      <Tooltip place="bottom" type="dark" effect="solid" id="readablity">
        Use Readability to make this article more readable
      </Tooltip>

      <Tooltip place="bottom" type="dark" effect="solid" id="google">
        Google this story in the embed browser
      </Tooltip>

      <div className={styles.webviewContainer}>
        <webview
          src={this.getURL()}
          ref="webview"
        />
      </div>
    </div>
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

  renderLoadingButton () {
    var className = `fa fa-refresh fa-spin ${styles.loading}`
    if (!this.state.loading) className += " " + styles.notLoading

    return <i className={className} />
  }

  // For PDF files we want to link to Google Doc's embed PDF viewer. The PDF
  // detecting isn't perfect but it's faster this way than to first download the
  // PDF, detect the filetype and then send it to Google Docs
  getURL () {
    var url = this.props.item.url

    if (/\.pdf/i.test(url)) url = `http://docs.google.com/gview?url=${window.encodeURI(url)}&embedded=true`

    return url
  }

  updateNavigation () {
    this.setState({
      canGoBack: this.refs.webview.canGoBack(),
      canGoForward: this.refs.webview.canGoForward(),
      loading: this.refs.webview.isLoading()
    })
  }


  onGoogle () {
    this.refs.webview.src = `https://www.google.com/search?q=${this.props.item.title}`
  }

  onReadability () {
    const webview = this.refs.webview

    if (/^https?:\/\/www.readability.com\/articles/.test(webview.src)) {
      webview.goBack()
    } else {
      webview.executeJavaScript(readabilityCode)
    }
  }
}
