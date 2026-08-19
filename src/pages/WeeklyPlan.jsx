import React, { useMemo, useState } from 'react'
import { useStudy } from '../context/StudyContext'
import { generateWeeklyPlan } from '../utils/aiBalancer'
import { Calendar, RefreshCw, Download, Clock, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react'
import { format, startOfWeek, addDays, addWeeks, subWeeks } from 'date-fns'

export default function WeeklyPlan() {
  const { state, dispatch } = useStudy()
  const { subjects, sessions, settings } = state
  
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [isGenerating, setIsGenerating] = useState(false)
  
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 })
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
  
  const plan = useMemo(() => {
    if (subjects.length === 0) return []
    return generateWeeklyPlan(subjects, sessions, settings)
  }, [subjects, sessions, settings])
  
  const handleGenerate = () => {
    setIsGenerating(true)
    setTimeout(() => {
      const newPlan = generateWeeklyPlan(subjects, sessions, settings)
      dispatch({ type: 'SET_WEEKLY_PLAN', payload: newPlan })
      setIsGenerating(false)
    }, 500)
  }
  
  const handleExport = () => {
    // Generate ICS file
    let icsContent = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Smart Study Load Balancer//EN\n'
    
    plan.forEach(session => {
      if (session.date) {
        const dateStr = session.date.replace(/-/g, '')
        let startHour = 9
        if (session.timeSlot === 'afternoon') startHour = 14
        if (session.timeSlot === 'evening') startHour = 18
        
        const startTime = `${dateStr}T${String(startHour).padStart(2, '0')}00`
        const endTime = `${dateStr}T${String(startHour + 1).padStart(2, '0')}00`
        
        icsContent += `BEGIN:VEVENT\n`
        icsContent += `DTSTART:${startTime}\n`
        icsContent += `DTEND:${endTime}\n`
        icsContent += `SUMMARY:Study ${session.subjectName}\n`
        icsContent += `DESCRIPTION:AI-generated study session\n`
        icsContent += `END:VEVENT\n`
      }
    })
    
    icsContent += 'END:VCALENDAR'
    
    const blob = new Blob([icsContent], { type: 'text/calendar' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'study-plan.ics'
    a.click()
    URL.revokeObjectURL(url)
  }
  
  const getSessionsForDay = (day) => {
    const dayStr = format(day, 'yyyy-MM-dd')
    return plan.filter(s => s.date === dayStr)
  }
  
  const TIME_SLOTS = ['Morning', 'Afternoon', 'Evening']
  
  const getTimeSlotColor = (difficulty) => {
    switch (difficulty) {
      case 'hard': return 'var(--error)'
      case 'medium': return 'var(--warning)'
      default: return 'var(--success)'
    }
  }
  
  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Weekly Plan</h1>
          <p style={styles.subtitle}>AI-generated optimized study schedule</p>
        </div>
        
        <div style={styles.headerActions}>
          <button 
            onClick={handleGenerate}
            disabled={isGenerating || subjects.length === 0}
            style={{
              ...styles.generateButton,
              ...(isGenerating || subjects.length === 0 ? styles.generateButtonDisabled : {}),
            }}
          >
            <RefreshCw size={18} style={{ animation: isGenerating ? 'spin 1s linear infinite' : 'none' }} />
            {isGenerating ? 'Generating...' : 'Regenerate'}
          </button>
          
          {plan.length > 0 && (
            <button onClick={handleExport} style={styles.exportButton}>
              <Download size={18} />
              Export
            </button>
          )}
        </div>
      </div>
      
      {/* Week Navigation */}
      <div style={styles.weekNav}>
        <button onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))} style={styles.navButton}>
          <ChevronLeft size={20} />
        </button>
        <div style={styles.weekLabel}>
          <Calendar size={18} />
          <span>{format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d, yyyy')}</span>
        </div>
        <button onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))} style={styles.navButton}>
          <ChevronRight size={20} />
        </button>
      </div>
      
      {/* Calendar Grid */}
      {subjects.length > 0 ? (
        <div style={styles.calendar}>
          {/* Header */}
          <div style={styles.calendarHeader}>
            <div style={styles.timeSlotHeader}></div>
            {weekDays.map(day => (
              <div key={day.toISOString()} style={styles.dayHeader}>
                <span style={styles.dayName}>{format(day, 'EEE')}</span>
                <span style={styles.dayDate}>{format(day, 'd')}</span>
              </div>
            ))}
          </div>
          
          {/* Time Slots */}
          {TIME_SLOTS.map(slot => (
            <div key={slot} style={styles.timeSlotRow}>
              <div style={styles.timeSlotLabel}>
                <Clock size={14} />
                <span>{slot}</span>
              </div>
              
              {weekDays.map(day => {
                const dayStr = format(day, 'yyyy-MM-dd')
                const daySessions = getSessionsForDay(day).filter(
                  s => s.timeSlot.toLowerCase() === slot.toLowerCase()
                )
                
                return (
                  <div key={`${dayStr}-${slot}`} style={styles.calendarCell}>
                    {daySessions.map(session => (
                      <div 
                        key={session.id} 
                        style={{
                          ...styles.sessionBlock,
                          background: `${session.subjectColor}20`,
                          borderLeft: `3px solid ${session.subjectColor}`,
                        }}
                      >
                        <span style={styles.sessionName}>{session.subjectName}</span>
                        <span style={styles.sessionDuration}>{session.duration} min</span>
                        {session.isAISuggested && (
                          <div style={styles.aiBadge}>
                            <Sparkles size={10} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      ) : (
        <div style={styles.emptyState}>
          <Calendar size={48} />
          <h3>No subjects to plan</h3>
          <p>Add subjects first to generate your weekly study plan</p>
        </div>
      )}
      
      {/* Legend */}
      {subjects.length > 0 && (
        <div style={styles.legend}>
          <div style={styles.legendTitle}>Difficulty Legend</div>
          <div style={styles.legendItems}>
            <div style={styles.legendItem}>
              <span style={{...styles.legendDot, background: 'var(--success)'}} />
              <span>Easy</span>
            </div>
            <div style={styles.legendItem}>
              <span style={{...styles.legendDot, background: 'var(--warning)'}} />
              <span>Medium</span>
            </div>
            <div style={styles.legendItem}>
              <span style={{...styles.legendDot, background: 'var(--error)'}} />
              <span>Hard</span>
            </div>
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

const styles = {
  page: {
    padding: '32px',
    marginLeft: '240px',
    maxWidth: '1400px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '24px',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 700,
    marginBottom: '4px',
  },
  subtitle: {
    color: 'var(--text-muted)',
  },
  headerActions: {
    display: 'flex',
    gap: '12px',
  },
  generateButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    background: 'linear-gradient(135deg, var(--secondary), #7C3AED)',
    color: 'white',
    borderRadius: 'var(--radius-md)',
    fontWeight: 600,
    fontSize: '0.9375rem',
  },
  generateButtonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  exportButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    background: 'var(--surface-light)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--text-secondary)',
    fontWeight: 500,
  },
  weekNav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '20px',
    marginBottom: '24px',
    padding: '16px',
    background: 'var(--surface)',
    borderRadius: 'var(--radius-lg)',
  },
  navButton: {
    background: 'var(--surface-light)',
    color: 'var(--text-secondary)',
    padding: '8px',
    borderRadius: 'var(--radius-md)',
  },
  weekLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '1.125rem',
    fontWeight: 600,
  },
  calendar: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
  },
  calendarHeader: {
    display: 'grid',
    gridTemplateColumns: '100px repeat(7, 1fr)',
    background: 'var(--surface-light)',
    borderBottom: '1px solid var(--border)',
  },
  timeSlotHeader: {
    padding: '16px',
  },
  dayHeader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '16px 8px',
    borderLeft: '1px solid var(--border)',
  },
  dayName: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    fontWeight: 600,
  },
  dayDate: {
    fontSize: '1.5rem',
    fontWeight: 700,
  },
  timeSlotRow: {
    display: 'grid',
    gridTemplateColumns: '100px repeat(7, 1fr)',
    borderBottom: '1px solid var(--border)',
  },
  timeSlotLabel: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    padding: '20px 8px',
    fontSize: '0.75rem',
    fontWeight: 600,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
  },
  calendarCell: {
    minHeight: '100px',
    padding: '8px',
    borderLeft: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  sessionBlock: {
    position: 'relative',
    padding: '8px 10px',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    transition: 'all var(--transition-fast)',
  },
  sessionName: {
    display: 'block',
    fontSize: '0.8125rem',
    fontWeight: 600,
    lineHeight: 1.3,
  },
  sessionDuration: {
    display: 'block',
    fontSize: '0.6875rem',
    color: 'var(--text-muted)',
    marginTop: '2px',
  },
  aiBadge: {
    position: 'absolute',
    top: '4px',
    right: '4px',
    color: 'var(--primary)',
  },
  legend: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    marginTop: '24px',
    padding: '16px 20px',
    background: 'var(--surface)',
    borderRadius: 'var(--radius-lg)',
  },
  legendTitle: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: 'var(--text-secondary)',
  },
  legendItems: {
    display: 'flex',
    gap: '16px',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.875rem',
    color: 'var(--text-muted)',
  },
  legendDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 40px',
    textAlign: 'center',
    color: 'var(--text-muted)',
    background: 'var(--surface)',
    border: '1px dashed var(--border)',
    borderRadius: 'var(--radius-lg)',
  },
}
