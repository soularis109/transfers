import type { RootState } from '../../../app/store'
import { STOPS_OPTIONS } from '../../../entities/ticket/model/types'

export const selectSelectedStops = (state: RootState) => state.stopsFilter.selectedStops
export const selectIsAllStopsSelected = (state: RootState) =>
  STOPS_OPTIONS.every((option) => state.stopsFilter.selectedStops.includes(option))