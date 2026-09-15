import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { STOPS_OPTIONS, type StopsCount } from '../../../entities/ticket/model'

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
      state.selectedStops = [...STOPS_OPTIONS]
    },
    clearAll: (state) => {
      state.selectedStops = []
    },
    setStops: (state, action: PayloadAction<StopsCount[]>) => {
      state.selectedStops = Array.from(new Set(action.payload))
    },
  },
})

export const { toggleStop, selectAll, clearAll, setStops } = filterSlice.actions
export default filterSlice.reducer
