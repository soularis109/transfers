import { createSlice, isAnyOf } from '@reduxjs/toolkit'
import { PAGE_SIZE } from '../../../entities/ticket/model/types'
import { toggleStop, selectAll, clearAll } from '../../stops-filter/model/filterSlice'
import { setSort } from '../../tickets-sort/model/sortSlice'

interface PaginationState {
  visibleCount: number
}

const initialState: PaginationState = { visibleCount: PAGE_SIZE }

const paginationSlice = createSlice({
  name: 'ticketsPagination',
  initialState,
  reducers: {
    showMore: (state) => {
      state.visibleCount += PAGE_SIZE
    },
    resetPagination: (state) => {
      state.visibleCount = PAGE_SIZE
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(toggleStop, selectAll, clearAll, setSort), (state) => {
      state.visibleCount = PAGE_SIZE
    })
  },
})

export const { showMore, resetPagination } = paginationSlice.actions
export default paginationSlice.reducer