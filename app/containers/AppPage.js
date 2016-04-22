import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import App from '../containers/App'
import * as StoriesActions from '../actions/stories'

function mapStateToProps (state) {
  return {
    stories: state.stories
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(StoriesActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
