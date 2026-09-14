import { describe, expect, it } from 'vitest'
import paginationReducer, { showMore, resetPagination } from './paginationSlice'

const initialState = { visibleCount: 5 }

describe('paginationSlice', () => {
  it('returns the initial state with visibleCount = PAGE_SIZE', () => {
    expect(paginationReducer(undefined, { type: 'unknown' })).toEqual(initialState)
  })

  it('showMore increases visibleCount by PAGE_SIZE', () => {
    const state = paginationReducer(initialState, showMore())
    expect(state.visibleCount).toBe(10)
  })

  it('resetPagination resets visibleCount back to PAGE_SIZE', () => {
    const state = paginationReducer({ visibleCount: 20 }, resetPagination())
    expect(state.visibleCount).toBe(5)
  })
})
