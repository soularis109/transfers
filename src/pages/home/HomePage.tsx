import { useEffect } from 'react'
import './HomePage.scss'
import { useAppDispatch } from '../../shared/lib/hooks'
import { fetchTickets } from '../../entities/ticket/model/ticketsSlice'
import Logo from '../../shared/ui/Logo'
import StopsFilterCard from '../../features/stops-filter/ui/StopsFilterCard'
import TicketsBoard from '../../widgets/tickets-board/ui/TicketsBoard'

function HomePage() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchTickets())
  }, [dispatch])

  return (
    <div className="home-page">
      <header className="home-page__header">
        <Logo />
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
