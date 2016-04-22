import { INCREMENT_COUNTER, DECREMENT_COUNTER } from '../actions/stories'

import {
  SELECT_PREVIOUS, SELECT_NEXT, CHANGE_SELECTION, CHANGE_WEBSITE_WIDTH, CHANGE_RESOURCE,
  START_RESIZING, END_RESIZING, CHANGE_DISPLAY, CYCLE_DISPLAY, SET_LOADING, SET_LOADING_SECOND_PAGE, SET_FAILED, SET_DATA
} from '../actions/stories'

const defaultState = {
  loading: false,
  failed: false,
  resource: 'news',
  data: [],
  loadedSecond: false, // Was the second top stories page loaded?,
  selected: 0,
  resizing: false,
  websiteWidth: 60, // in percent
  display: 'both' // both, link, comments
}

export default function counter(state = defaultState, action) {
  let { type, ...changes } = action

  switch (type) {
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
    default:
      return state
  }
}
