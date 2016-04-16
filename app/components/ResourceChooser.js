import React, { Component } from 'react'
import styles from './ResourceChooser.styl'

const resources = {
  "news": "Top Stories",
  "newest": "Newest Stories",
  "ask": "Ask HN",
  "show": "Show HN",
  "shownew": "Newest Show HN",
  "best": "Highest voted recent links",
  "active": "Most active current discussions",
  "noobstories": "Submissions from new users"
}

export default class ResourceChooser extends Component {
  static propTypes = {
    open: React.PropTypes.bool.isRequired,
    onChange: React.PropTypes.func.isRequired
  }

  constructor (props, context) {
    super(props, context)
  }

  render () {
    return <div className={`${styles.chooser} ${this.props.open ? styles.open : ""}`}>
      <ul>
        {Object.keys(resources).map(this.renderResource, this)}
      </ul>
    </div>
  }

  renderResource (key) {
    const label = resources[key]
    return <li key={key} className={styles.option} onClick={this.changeResource.bind(this, key)}>{label}</li>
  }

  changeResource (key) {
    this.props.onChange(key)
  }
}
