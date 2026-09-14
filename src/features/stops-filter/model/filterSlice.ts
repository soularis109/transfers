import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { StopsCount } from '../../../entities/ticket/model/types'

interface FilterState {
  selectedStops: StopsCount[]
}

const initialState: FilterState = { selectedStops: [] }

const filterSlice = createSlice({
  name: 'stopsFilter',
  initialState,
  reducers: {
    toggleStop: (state, action: PayloadAction<StopsCount>) => {
      const index = state.selectedStops.indexOf(action.payload)
      if (index === -1) state.selectedStops.push(action.payload)
      else state.selectedStops.splice(index, 1)
    },
    selectAll: (state) => {
      state.selectedStops = [0, 1, 2, 3]
    },
    clearAll: (state) => {
      state.selectedStops = []
    },
  },
})

export const { toggleStop, selectAll, clearAll } = filterSlice.actions
export default filterSlice.reducer