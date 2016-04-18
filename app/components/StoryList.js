import React, { Component } from 'react'
import styles from './StoryList.styl'

import ListHeader from '../components/ListHeader'
import ResourceChooser from '../components/ResourceChooser'
import StoryListItem from '../components/StoryListItem'

export default class StoryList extends Component {
  static propTypes = {
    data: React.PropTypes.array.isRequired,
    selected: React.PropTypes.number,
    changeSelection: React.PropTypes.func.isRequired,
    onResourceChange: React.PropTypes.func.isRequired,
    resource: React.PropTypes.string.isRequired,
    onDisplayChange: React.PropTypes.func.isRequired,
    loading: React.PropTypes.bool.isRequired,
    onReload: React.PropTypes.func.isRequired,
    failed: React.PropTypes.bool.isRequired,
    onWaypoint: React.PropTypes.func.isRequired
  }

  constructor (props, context) {
    super(props, context)

    this.state = {
      chooserOpen: false
    }
  }

  render () {
    var className = styles.listContainer
    if (this.props.selected === undefined) className += " " + styles.nothingChosen

    return <div className={className} onScroll={this.onScroll.bind(this)}>
      <ListHeader
        onHamburger={this.toggleChooser.bind(this)}
        enabled={this.state.chooserOpen} resource={this.props.resource}
        onDisplayChange={this.props.onDisplayChange}
        selectedStory={this.props.data[this.props.selected]}
        loading={this.props.loading}
        onReload={this.props.onReload}
        failed={this.props.failed}
      />

      <ResourceChooser open={this.state.chooserOpen} onChange={this.changeResource.bind(this)} />

      <ol ref="container" className={`${styles.storyList} ${this.state.chooserOpen ? styles.listInBackground : ""}`}>
      {this.props.data.map(this.renderItem, this)}
      </ol>
    </div>
  }

  renderItem (item, i) {
    const isSelected = i === this.props.selected
    return <StoryListItem i={i} key={item.id} item={item} isSelected={isSelected} onClick={() => this.props.changeSelection(i)} />
  }

  toggleChooser () {
    this.setState({ chooserOpen: !this.state.chooserOpen })
  }

  changeResource (key) {
    this.setState({ chooserOpen: false })
    this.props.onResourceChange(key)
  }

  onScroll () {
    const container = this.refs.container
    const scrollTop = container.scrollTop
    // This is the maximum value scrollTop can have
    const maxScrollTop = container.scrollHeight - container.clientHeight

    // We want to trigger the Waypoint event if the user scrolled past 2/3 of
    // the storys
    if (scrollTop >= maxScrollTop * 2/3) this.props.onWaypoint()
  }
}
