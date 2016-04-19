import React, { Component } from 'react'
import styles from './DisplayChooser.styl'

import Tooltip from 'react-tooltip'

const DisplayOption = (props) => {
  var className = styles.option + " " + styles[props.name]

  const isSelected = props.name == props.selected
  if (isSelected) className +=  " " + styles.selected

  return <a data-tip data-for={props.name} onClick={() => props.onClick(props.name)} className={className}>
    {props.children}
  </a>
}

export default class DisplayChooser extends Component {
  static propTypes = {
    onChange: React.PropTypes.func.isRequired,
    story: React.PropTypes.object,
    display: React.PropTypes.string.isRequired,
    isSelfPost: React.PropTypes.bool.isRequired
  }

  constructor (props, context) {
    super(props, context)
  }

  render () {
    const story = this.props.story
    if (story === undefined) return false

    var className = `unimportantHeaderElement ${styles.options}`
    var display = this.props.display

    if (this.props.isSelfPost) {
      className += " " + styles.selfPost
      display = "comments"
    }

    return <span className={className}>
      <DisplayOption name="both" onClick={this.props.onChange} selected={display}>
        <i className="fa fa-link" aria-hidden="true"></i>
        <i className="fa fa-comment-o" aria-hidden="true"></i>
      </DisplayOption>

      <Tooltip place="bottom" type="dark" effect="solid" id="both">
        {this.props.isSelfPost ? "This is a self post, there are only comments" : "Show both, website and comments, next to each other"}
      </Tooltip>

      <DisplayOption name="link" onClick={this.props.onChange} selected={display}>
        <i className="fa fa-link" aria-hidden="true"></i>
      </DisplayOption>

      <Tooltip place="bottom" type="dark" effect="solid" id="link">
      {this.props.isSelfPost ? "This is a self post, there are only comments" : "Show only the website"}
      </Tooltip>

      <DisplayOption name="comments" onClick={this.props.onChange} selected={display}>
        <i className="fa fa-comment-o" aria-hidden="true"></i>
      </DisplayOption>

      <Tooltip place="bottom" type="dark" effect="solid" id="comments">
        Show only the comments
      </Tooltip>
    </span>
  }
}
