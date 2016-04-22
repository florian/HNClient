import React, { Component } from 'react'
import styles from './KeyboardShortcutInfo.styl'

import key from 'keymaster'

import Modal from 'simple-react-modal'

const Shortcut = ({ label, char }) => {
  return <li>
    <span className={styles.char}>{char}</span>
    <span className={styles.label}>{label}</span>
  </li>
}

export default class KeyboardShortcutInfo extends Component {
  constructor (props, context) {
    super(props, context)

    this.state = {
      show: false
    }
  }

  componentDidMount () {
    key('h', 'all', this.toggleDisplay.bind(this))
    document.body.addEventListener('keypress', this.handleQuestionMark.bind(this))
  }

  componentWillUnmount () {
    key.undbind('h', 'all')
    document.body.removeEventListener('keypress', this.handleQuestionMark.bind(this))
  }

  render () {
    return <Modal show={this.state.show} onClose={this.close.bind(this)}>
      <h2 className={styles.header}>Keyboard Shortcuts</h2>
      <ul className={styles.list}>
        <Shortcut char='j' label='next story' />
        <Shortcut char='k' label='previous story' />
        <Shortcut char='l' label="toggle between the WebView, comments and showing both. When you go to another story the view is changed to whatever display option you last chose in the menu bar" />
        <Shortcut char='n' label='next comment' />
        <Shortcut char='m' label='previous comment' />
        <Shortcut char='enter' label='fold or expand the selected comment' />
        <Shortcut char='r' label='reload the stories' />
        <Shortcut char='h' label='show this help' />
      </ul>
    </Modal>
  }

  toggleDisplay () {
    this.setState({ show: !this.state.show })
  }

  close () {
    this.setState({ show: false })
  }

  // Apparently none of the major JavaScript keyboard shortcut libraries can
  // handle detecting ? well on international keyboards. This atleast works on
  // the German keyboard.
  handleQuestionMark (e) {
    const pressedChar = String.fromCharCode(e.keyCode)
    if (pressedChar === '?') this.toggleDisplay()
  }
}
