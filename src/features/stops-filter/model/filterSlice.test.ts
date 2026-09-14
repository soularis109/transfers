import { describe, expect, it } from 'vitest'
import filterReducer, { toggleStop, selectAll, clearAll } from './filterSlice'

const initialState = { selectedStops: [] }

describe('filterSlice', () => {
  it('returns the initial state', () => {
    expect(filterReducer(undefined, { type: 'unknown' })).toEqual(initialState)
  })

  it('toggleStop adds a value that is not selected yet', () => {
    const state = filterReducer(initialState, toggleStop(1))
    expect(state.selectedStops).toEqual([1])
  })

  it('toggleStop removes a value that is already selected', () => {
    const state = filterReducer({ selectedStops: [0, 1] }, toggleStop(1))
    expect(state.selectedStops).toEqual([0])
  })

  it('selectAll selects every stops option', () => {
    const state = filterReducer(initialState, selectAll())
    expect(state.selectedStops).toEqual([0, 1, 2, 3])
  })

  it('clearAll empties the selection', () => {
    const state = filterReducer({ selectedStops: [0, 1, 2, 3] }, clearAll())
    expect(state.selectedStops).toEqual([])
  })
})