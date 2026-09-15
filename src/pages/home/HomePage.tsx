import { useEffect } from 'react'
import './HomePage.scss'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { fetchTickets, selectTicketsStatus } from '@/entities/ticket/model'
import Logo from '@/shared/ui/Logo'
import StopsFilterCard from '@/features/stops-filter/ui/StopsFilterCard'
import TicketsBoard from '@/widgets/tickets-board/ui/TicketsBoard'
import { useUrlFilterSync } from '@/features/url-sync/lib'
import { clearAll } from '@/features/stops-filter/model'
import { setSort } from '@/features/tickets-sort/model'

function HomePage() {
  const dispatch = useAppDispatch()
  const status = useAppSelector(selectTicketsStatus)

  useUrlFilterSync()

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchTickets())
    }
  }, [dispatch, status])

  const handleLogoClick = () => {
    dispatch(clearAll())
    dispatch(setSort('cheapest'))
  }

  return (
    <div className="home-page">
      <header className="home-page__header">
        <Logo onClick={handleLogoClick} />
      </header>
      <div className="home-page__layout">
        <aside className="home-page__sidebar">
          <StopsFilterCard />
        </aside>
        <main className="home-page__content">
          <TicketsBoard />
        </main>
      </div>
    </div>
  )
}

export default HomePage
