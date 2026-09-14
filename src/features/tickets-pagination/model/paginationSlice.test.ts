import { describe, expect, it } from 'vitest'
import paginationReducer, { showMore, resetPagination } from './paginationSlice'
import { toggleStop } from '../../stops-filter/model/filterSlice'
import { setSort } from '../../tickets-sort/model/sortSlice'

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

  it('resets visibleCount when a filter action is dispatched', () => {
    const afterShowMore = paginationReducer(initialState, showMore())
    const state = paginationReducer(afterShowMore, toggleStop(1))
    expect(state.visibleCount).toBe(5)
  })

  it('resets visibleCount when a sort action is dispatched', () => {
    const afterShowMore = paginationReducer(initialState, showMore())
    const state = paginationReducer(afterShowMore, setSort('fastest'))
    expect(state.visibleCount).toBe(5)
  })
})