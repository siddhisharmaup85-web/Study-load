import React from 'react'
import { StudyProvider, useStudy } from './context/StudyContext'
import Sidebar from './components/Layout/Sidebar'
import Dashboard from './pages/Dashboard'
import Subjects from './pages/Subjects'
import Sessions from './pages/Sessions'
import WeeklyPlan from './pages/WeeklyPlan'
import Settings from './pages/Settings'
import About from './pages/About'

function AppContent() {
  const { state, dispatch } = useStudy()
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false)
  
  const renderPage = () => {
    switch (state.currentPage) {
      case 'dashboard':
        return <Dashboard />
      case 'subjects':
        return <Subjects />
      case 'sessions':
        return <Sessions />
      case 'weekly-plan':
        return <WeeklyPlan />
      case 'settings':
        return <Settings />
      case 'about':
        return <About />
      default:
        return <Dashboard />
    }
  }
  
  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen)
  }
  
  const closeMobileSidebar = () => {
    setMobileSidebarOpen(false)
  }
  
  return (
    <div className={`app ${mobileSidebarOpen ? 'mobile-sidebar-open' : ''}`}>
      <div className="sidebar-overlay" onClick={closeMobileSidebar} />
      <header className="mobile-header">
        <button className="hamburger" onClick={toggleMobileSidebar}>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
      </header>
      <Sidebar isMobileOpen={mobileSidebarOpen} onClose={closeMobileSidebar} />
      <main className="page">
        {renderPage()}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <StudyProvider>
      <AppContent />
    </StudyProvider>
  )
}


