import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { DEFAULT_SORT_KEY, type SortKey } from '@/entities/ticket/model'

interface SortState {
  activeSort: SortKey
}

const initialState: SortState = { activeSort: DEFAULT_SORT_KEY }

const sortSlice = createSlice({
  name: 'ticketsSort',
  initialState,
  reducers: {
    setSort: (state, action: PayloadAction<SortKey>) => {
      state.activeSort = action.payload
    },
  },
})

export const { setSort } = sortSlice.actions
export default sortSlice.reducer
