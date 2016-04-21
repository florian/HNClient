import React, { Component } from 'react'
import styles from './Resizer.styl'

export default class Resizer extends Component {
  static propTypes = {
    onResize: React.PropTypes.func.isRequired,
    onResizeEnd: React.PropTypes.func,
    show: React.PropTypes.bool
  }

  static defaultProps = {
    show: true
    onResizeEnd: () => {}
  }

  constructor (props, context) {
    super(props, context)

    this.state = {
      clicked: false,
      pos: 0
    }
  }

  componentDidMount () {
    document.body.addEventListener("mouseup", this.onMouseUp.bind(this));
    document.body.addEventListener("mousemove", this.onMouseMove.bind(this));
  }

  componentWillUnmount () {
    document.body.removeEventListener("mouseup", this.onMouseUp.bind(this));
    document.body.removeEventListener("mousemove", this.onMouseMove.bind(this));
  }

  render () {
    const style = { left: `calc(400px + ((100% - 400px) * ${this.props.width} / 100))` }
    if (!this.props.show) style.display = "none"

    return <div
      className={styles.resizer}
      style={style}
      onMouseDown={this.onMouseDown.bind(this)} />
  }

  onMouseDown (e) {
    this.setState({ clicked: true, pos: e.clientX  })
  }

  onMouseUp (e) {
    if (this.state.clicked === false) return false

    this.setState({ clicked: false, pos: 0 })
    this.props.onResizeEnd()
  }

  onMouseMove (e) {
    if (this.state.clicked) {
      const diff = e.clientX - this.state.pos
      if (diff !== 0 && this.props.onResize(diff)) {
        this.setState({ pos: e.clientX})
      }
    }
  }
}
