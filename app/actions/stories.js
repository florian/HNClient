import api from '../api/stories.js'

export const SELECT_PREVIOUS = 'SELECT_PREVIOUS'
export const SELECT_NEXT = 'SELECT_NEXT'
export const CHANGE_SELECTION = 'CHANGE_SELECTION'
export const CHANGE_WEBSITE_WIDTH = 'CHANGE_WEBSITE_WIDTH'
export const CHANGE_RESOURCE = 'CHANGE_RESOURCE'
export const ENABLE_RESIZING = 'ENABLE_RESIZING'
export const DISABLE_RESIZING = 'DISABLE_RESIZING'
export const SET_WEBSITE_WIDTH = 'SET_WEBSITE_WIDTH'
export const CHANGE_DISPLAY = 'CHANGE_DISPLAY'
export const CYCLE_DISPLAY = 'CYCLE_DISPLAY'
export const SET_LOADING = 'SET_LOADING'
export const SET_LOADING_SECOND_PAGE = 'SET_LOADING_SECOND_PAGE'
export const SET_FAILED = 'SET_FAILED'
export const SET_DATA = 'SET_DATA'
export const MARK_STORY_AS_READ = 'MARK_STORY_AS_READ '
export const CLEANUP_READ_STORIES = 'CLEANUP_READ_STORIES '

export function selectPrevious () {
  return (dispatch, getState) => {
    const { selected } = getState().stories
    const index = Math.max(selected - 1, 0)

    dispatch(changeSelection(index))
  }
}

export function selectNext () {
  return (dispatch, getState) => {
    const { selected, data } = getState().stories
    const index = Math.min(selected + 1, data.length - 1)

    dispatch(changeSelection(index))
  }
}

export function changeSelection (selected) {
  return {
    type: CHANGE_SELECTION,
    selected
  }
}

export function changeWebsiteWidth (percent) {
  return {
    type: CHANGE_WEBSITE_WIDTH,
    percent
  }
}

export function changeResource (resource) {
  return {
    type: CHANGE_RESOURCE,
    resource
  }
}

export function enableResizing () {
  return {
    type: ENABLE_RESIZING
  }
}

export function disableResizing () {
  return {
    type: DISABLE_RESIZING
  }
}

export function setWebsiteWidth (websiteWidth) {
  return {
    type: SET_WEBSITE_WIDTH,
    websiteWidth
  }
}

export function changeDisplay (display) {
  return {
    type: CHANGE_DISPLAY,
    display
  }
}

export function cycleDisplay () {
  return {
    type: CYCLE_DISPLAY
  }
}

export function setLoading () {
  return {
    type: SET_LOADING
  }
}

export function setLoadingSecondPage () {
  return {
    type: SET_LOADING_SECOND_PAGE
  }
}

export function setFailed () {
  return {
    type: SET_FAILED
  }
}

export function setData ({ data, selected, loadedSecond = false }) {
  return {
    type: SET_DATA,
    data,
    selected,
    loadedSecond
  }
}

export function fetch () {
  return (dispatch, getState) => {
    dispatch(setLoading())

    const { resource } = getState().stories

    const onSuccess = (response) => {
      dispatch(setData({ data: response.data, selected: 0 }))
    }

    const onError = (response) => {
      dispatch(setFailed())
    }

    api.getStories(resource, onSuccess, onError)
  }
}

export function fetchSecond () {
  return (dispatch, getState) => {
    const { resource, loadedSecond, data, selected } = getState().stories

    if (resource !== 'news' || loadedSecond) return false

    dispatch(setLoadingSecondPage())

    const onSuccess = (response) => {
      dispatch(setData({ data: data.concat(response.data), loadedSecond: true, selected }))
    }

    const onError = (response) => {
      dispatch(setFailed())
    }

    api.getStories('news2', onSuccess, onError)
  }
}

export function markStoryAsRead (id) {
  return {
    type: MARK_STORY_AS_READ,
    id,
    timestamp: Date.now()
  }
}

export function cleanupReadStories () {
  return {
    type: CLEANUP_READ_STORIES
  }
}
