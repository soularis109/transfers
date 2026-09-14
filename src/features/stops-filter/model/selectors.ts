import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '../../../app/store'
import { STOPS_OPTIONS } from '../../../entities/ticket/model/types'

export const selectSelectedStops = (state: RootState) => state.stopsFilter.selectedStops

export const selectIsAllStopsSelected = createSelector([selectSelectedStops], (selectedStops) =>
  selectedStops.length === 0
    ? true
    : STOPS_OPTIONS.every((option) => selectedStops.includes(option)),
)
