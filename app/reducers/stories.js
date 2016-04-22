import { INCREMENT_COUNTER, DECREMENT_COUNTER } from '../actions/stories'

import {
  SELECT_PREVIOUS, SELECT_NEXT, CHANGE_SELECTION, CHANGE_WEBSITE_WIDTH, CHANGE_RESOURCE,
  START_RESIZING, END_RESIZING, CHANGE_DISPLAY, CYCLE_DISPLAY, FETCH, FETCH_SECOND
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
  switch (action.type) {
    case CHANGE_SELECTION:
      state.selected = action.index
    default:
      return state
  }
}
