import type { RootState } from '../../../app/store'

export const selectActiveSort = (state: RootState) => state.ticketsSort.activeSort