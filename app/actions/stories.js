import api from '../api/stories.js'

export const SELECT_PREVIOUS = 'SELECT_PREVIOUS'
export const SELECT_NEXT = 'SELECT_NEXT'
export const CHANGE_SELECTION = 'CHANGE_SELECTION'
export const CHANGE_WEBSITE_WIDTH = 'CHANGE_WEBSITE_WIDTH'
export const CHANGE_RESOURCE = 'CHANGE_RESOURCE'
export const START_RESIZING = 'START_RESIZING'
export const END_RESIZING = 'END_RESIZING'
export const CHANGE_DISPLAY = 'CHANGE_DISPLAY'
export const CYCLE_DISPLAY = 'CYCLE_DISPLAY'
export const FETCH = 'FETCH'
export const FETCH_SECOND = 'FETCH_SECOND'

export function selectPrevious () {
  return (dispatch, getState) => {
    const { selected } = getState()
    const index = Math.max(selected - 1, 0)

    dispatch(changeSelection(index))
  }
}

export function selectNext () {
  const { selected, data } = getState()
  const index = Math.max(selected + 1, data.length - 1)

  dispatch(changeSelection(index))
}

export function changeSelection (index) {
  return {
    type: CHANGE_SELECTION,
    index
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

export function startResizing () {
  return {
    type: START_RESIZING
  }
}

export function endResizing () {
  return {
    type: END_RESIZING
  }
}

export function changeDisplay (display) {
  return {
    type: CHANGE_DISPLAY,
    display
  }
}

export function cycleDisplay () {
  return (dispatch, getState) => {
    const { display } = getState()
    var newDisplay = ''

    if (display === 'both') newDisplay = 'link'
    else if (display === 'link') newDisplay = 'comments'
    else if (display === 'comments') newDisplay = 'link'

    dispatch(changeDisplay(newDisplay))
  }
}

export function fetch () {
  return (dispatch, getState) => {
    dispatch({ loading: true, failed: false })

    const { resource } = getState()

    const onSuccess = (response) => {
      dispatch({
        loading: false,
        loadedSecond: false,
        data: response.data,
        selected: 0
      })
    }

    const onError = (response) => {
      dispatch({ loading: false, failed: true })
    }

    api.getStories(resource, onSuccess, onFailed)
  }
}

export function fetch () {
  return (dispatch, getState) => {
    const { resource, loadedSecond, data } = getState()

    if (resource !== 'news' || loadedSecond) return false

    dispatch({ loading: true, failed: false, loadedSecond: true })

    const onSuccess = (response) => {
      dispatch({
        loading: false,
        data: data.concat(response.data)
      })
    }

    const onError = (response) => {
      dispatch({ loading: false, failed: true })
    }

    api.getStories('news2', onSuccess, onFailed)
  }
}
