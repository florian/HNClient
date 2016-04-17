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
    story: React.PropTypes.object
  }

  constructor (props, context) {
    super(props, context)

    this.state = {
      selected: "both"
    }
  }

  componentDidMount () {
    this.ensureCorrectDisplay()
  }

  componentDidUpdate () {
    this.ensureCorrectDisplay()
  }

  // If the selected story turns out to be a self post, then this means we can
  // only display the comment section, so we'll need to ensure that "comments"
  // is the current display selection.
  ensureCorrectDisplay () {
    if (this.props.story && this.isSelfPost() && this.state.selected !== "comments") {
      this.changeSelection("comments")
    }
  }

  render () {
    const story = this.props.story
    if (story === undefined) return false

    var className = styles.options
    if (this.isSelfPost()) className += " " + styles.selfPost

    return <span className={className}>
      <DisplayOption name="both" onClick={this.changeSelection.bind(this)} selected={this.state.selected}>
        <i className="fa fa-link" aria-hidden="true"></i>
        <i className="fa fa-comment-o" aria-hidden="true"></i>
      </DisplayOption>

      <Tooltip place="bottom" type="dark" effect="solid" id="both">
        {this.isSelfPost() ? "This is a self post, there are only comments" : "Show both, website and comments, next to each other"}
      </Tooltip>

      <DisplayOption name="link" onClick={this.changeSelection.bind(this)} selected={this.state.selected}>
        <i className="fa fa-link" aria-hidden="true"></i>
      </DisplayOption>

      <Tooltip place="bottom" type="dark" effect="solid" id="link">
      {this.isSelfPost() ? "This is a self post, there are only comments" : "Show only the website"}
      </Tooltip>

      <DisplayOption name="comments" onClick={this.changeSelection.bind(this)} selected={this.state.selected}>
        <i className="fa fa-comment-o" aria-hidden="true"></i>
      </DisplayOption>

      <Tooltip place="bottom" type="dark" effect="solid" id="comments">
        Show only the comments
      </Tooltip>
    </span>
  }

  changeSelection (key) {
    if (!this.isSelfPost() || key === "comments") {
      this.setState({ selected: key })
      this.props.onChange(key)
    }
  }

  isSelfPost () {
    return !this.props.story.domain
  }
}
