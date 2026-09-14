import type { RootState } from '../../../app/store'

export const selectVisibleCount = (state: RootState) => state.ticketsPagination.visibleCount