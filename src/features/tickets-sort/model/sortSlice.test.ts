import { describe, expect, it } from 'vitest'
import sortReducer, { setSort } from './sortSlice'

describe('sortSlice', () => {
  it('returns the initial state', () => {
    expect(sortReducer(undefined, { type: 'unknown' })).toEqual({ activeSort: 'cheapest' })
  })

  it('setSort updates the active sort key', () => {
    const state = sortReducer({ activeSort: 'cheapest' }, setSort('fastest'))
    expect(state.activeSort).toBe('fastest')
  })
})