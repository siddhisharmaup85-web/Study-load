import React from 'react'
import { useStudy } from '../../context/StudyContext'
import {
  LayoutDashboard,
  BookOpen,
  Clock,
  CalendarDays,
  Settings,
  Info,
  Sparkles,
} from 'lucide-react'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'subjects', label: 'Subjects', icon: BookOpen },
  { id: 'sessions', label: 'Sessions', icon: Clock },
  { id: 'weekly-plan', label: 'Weekly Plan', icon: CalendarDays },
{ id: 'settings', label: 'Settings', icon: Settings },
  { id: 'about', label: 'About', icon: Info },
]

export default function Sidebar({ isMobileOpen, onClose }) {
  const { state, dispatch } = useStudy()
  
  const handleNavClick = (pageId) => {
    dispatch({ type: 'SET_PAGE', payload: pageId })
    if (onClose) onClose()
  }
  
  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logo-icon">
          <Sparkles size={24} />
        </div>
        <div className="logo-text">
          <span className="logo-title">Study</span>
          <span className="logo-subtitle">Load Balancer</span>
        </div>
      </div>
      
      <nav className="nav">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = state.currentPage === item.id
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`nav-item ${isActive ? 'nav-item-active' : ''}`}
            >
              {isActive && <div className="active-indicator" />}
              <Icon size={20} className="nav-icon" />
              <span className="nav-label">{item.label}</span>
            </button>
          )
        })}
      </nav>
      
      <div className="footer">
        <div className="ai-badge">
          <Sparkles size={14} />
          <span>AI Powered</span>
        </div>
      </div>
    </aside>
  )
}


