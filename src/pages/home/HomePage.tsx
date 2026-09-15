import { useEffect } from 'react'
import './HomePage.scss'
import { useAppDispatch } from '@/shared/lib/store/hooks'
import { fetchTickets, DEFAULT_SORT_KEY } from '@/entities/ticket/model'
import Logo from '@/shared/ui/Logo'
import StopsFilterCard from '@/features/stops-filter/ui/StopsFilterCard'
import TicketsBoard from '@/widgets/tickets-board/ui/TicketsBoard'
import { useUrlFilterSync } from './lib/useUrlFilterSync'
import { clearAll } from '@/features/stops-filter/model'
import { setSort } from '@/features/tickets-sort/model'

function HomePage() {
  const dispatch = useAppDispatch()

  useUrlFilterSync()

  useEffect(() => {
    dispatch(fetchTickets())
  }, [dispatch])

  const handleLogoClick = () => {
    dispatch(clearAll())
    dispatch(setSort(DEFAULT_SORT_KEY))
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
