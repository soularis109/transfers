import { createSlice } from '@reduxjs/toolkit'
import { PAGE_SIZE } from '@/entities/ticket/model'

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
})

export const { showMore, resetPagination } = paginationSlice.actions
export default paginationSlice.reducer
