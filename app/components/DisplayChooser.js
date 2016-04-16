import React, { Component } from 'react'
import styles from './DisplayChooser.styl'

const DisplayOption = (props) => {
  const isSelected = props.name == props.selected

  return <span onClick={() => props.onClick(props.name)} className={`${styles.option} ${isSelected ? styles.selected : ""}`}>
    {props.children}
  </span>
}

export default class DisplayChooser extends Component {
  static propTypes = {
    onChange: React.PropTypes.func.isRequired
  }

  constructor (props, context) {
    super(props, context)

    this.state = {
      selected: "both"
    }
  }

  render () {
    return <span className={styles.options}>
      <DisplayOption name="both" onClick={this.changeSelection.bind(this)} selected={this.state.selected}>
        <i className="fa fa-link" aria-hidden="true"></i>
        <i className="fa fa-comment-o" aria-hidden="true"></i>
      </DisplayOption>

      <DisplayOption name="link" onClick={this.changeSelection.bind(this)} selected={this.state.selected}>
        <i className="fa fa-link" aria-hidden="true"></i>
      </DisplayOption>

      <DisplayOption name="comments" onClick={this.changeSelection.bind(this)} selected={this.state.selected}>
        <i className="fa fa-comment-o" aria-hidden="true"></i>
      </DisplayOption>
    </span>
  }

  changeSelection (key) {
    this.setState({ selected: key })
    this.props.onChange(key)
  }
}
