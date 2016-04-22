import { INCREMENT_COUNTER, DECREMENT_COUNTER } from '../actions/stories'
import objectFilter from 'object-filter'

import {
  SELECT_PREVIOUS, SELECT_NEXT, CHANGE_SELECTION, CHANGE_WEBSITE_WIDTH, CHANGE_RESOURCE, ENABLE_RESIZING, DISABLE_RESIZING,
  SET_WEBSITE_WIDTH, CHANGE_DISPLAY, CYCLE_DISPLAY, SET_LOADING, SET_LOADING_SECOND_PAGE, SET_FAILED, SET_DATA,
  MARK_STORY_AS_READ, CLEANUP_READ_STORIES
} from '../actions/stories'
import { REHYDRATE, REHYDRATE_COMPLETE } from 'redux-persist/constants'

const defaultState = {
  loading: false,
  failed: false,
  resource: 'news',
  data: [],
  loadedSecond: false, // Was the second top stories page loaded?,
  selected: 0,
  resizing: false,
  websiteWidth: 60, // in percent
  display: 'both', // both, link, comments
  readStories: {}
}

export default function counter(state = defaultState, action) {
  let { type, ...changes } = action

  switch (type) {
    case REHYDRATE:
      var result = action.payload.stories
      return { ...result, selected: 0 }
    case CHANGE_SELECTION:
      return { ...state, ...changes }
    case SET_LOADING:
      return { ...state, loading: true, failed: false }
    case SET_LOADING_SECOND_PAGE:
      return { ...state, loading: true, loadedSecond: true, failed: false }
    case SET_FAILED:
      return { ...state, loading: false, failed: true }
    case SET_DATA:
      return { ...state, loading: false, failed: false, ...changes }
    case CHANGE_RESOURCE:
      return { ...state, ...changes }
    case CHANGE_DISPLAY:
      return { ...state, ...changes }
    case ENABLE_RESIZING:
      return { ...state, resizing: true }
    case DISABLE_RESIZING:
      return { ...state, resizing: false }
    case SET_WEBSITE_WIDTH:
      return { ...state, ...changes }
    case MARK_STORY_AS_READ:
      var readStories = { ...state.readStories }
      readStories[action.id] = action.timestamp
      return { ...state, readStories }
    case CLEANUP_READ_STORIES:
      const twoWeeksAgo = Date.now() - 14 * 24 * 60 * 60 * 1000
      const readStories = objectFilter(state.readStories, (timestamp, id) => timestamp >= twoWeeksAgo)
      return { ...state, readStories }
    default:
      return state
  }
}
