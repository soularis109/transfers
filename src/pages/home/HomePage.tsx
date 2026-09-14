import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../shared/lib/hooks'
import { fetchTickets } from '../../entities/ticket/model/ticketsSlice'
import {
  selectAllTickets,
  selectTicketsStatus,
  selectTicketsError,
} from '../../entities/ticket/model/selectors'

function HomePage() {
  const dispatch = useAppDispatch()
  const tickets = useAppSelector(selectAllTickets)
  const status = useAppSelector(selectTicketsStatus)
  const error = useAppSelector(selectTicketsError)

  useEffect(() => {
    dispatch(fetchTickets())
  }, [dispatch])

  if (status === 'loading' || status === 'idle') {
    return <div>Завантаження…</div>
  }
  if (status === 'failed') {
    return <div>Помилка: {error}</div>
  }
  return <div>Завантажено квитків: {tickets.length}</div>
}

export default HomePage