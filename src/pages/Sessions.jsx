import React, { useState } from 'react'
import { useStudy } from '../context/StudyContext'
import { Plus, Trash2, X, Clock, Star, Calendar, FileText } from 'lucide-react'
import { format } from 'date-fns'

export default function Sessions() {
  const { state, dispatch } = useStudy()
  const { subjects, sessions } = state
  
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    subjectId: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '09:00',
    duration: 50,
    productivity: 3,
    notes: '',
  })
  
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.subjectId) return
    
    const dateTime = new Date(`${formData.date}T${formData.time}`)
    
    dispatch({
      type: 'ADD_SESSION',
      payload: {
        subjectId: formData.subjectId,
        date: dateTime.toISOString(),
        duration: parseInt(formData.duration),
        productivity: parseInt(formData.productivity),
        notes: formData.notes,
      },
    })
    
    resetForm()
  }
  
  const resetForm = () => {
    setShowForm(false)
    setFormData({
      subjectId: subjects[0]?.id || '',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '09:00',
      duration: 50,
      productivity: 3,
      notes: '',
    })
  }
  
  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this session?')) {
      dispatch({ type: 'DELETE_SESSION', payload: id })
    }
  }
  
  const getSubjectName = (subjectId) => {
    const subject = subjects.find(s => s.id === subjectId)
    return subject?.name || 'Unknown'
  }
  
  const getSubjectColor = (subjectId) => {
    const subject = subjects.find(s => s.id === subjectId)
    return subject?.color || '#8B5CF6'
  }
  
  // Sort sessions by date (newest first)
  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  )
  
  // Group sessions by date
  const groupedSessions = sortedSessions.reduce((groups, session) => {
    const dateKey = format(new Date(session.date), 'yyyy-MM-dd')
    if (!groups[dateKey]) {
      groups[dateKey] = []
    }
    groups[dateKey].push(session)
    return groups
  }, {})
  
  return (
    <div className="page max-w-4xl mx-auto">
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Study Sessions</h1>
          <p style={styles.subtitle}>Log and track your study sessions</p>
        </div>
        {subjects.length > 0 && (
          <button 
            onClick={() => setShowForm(true)}
            style={styles.addButton}
          >
            <Plus size={18} />
            Log Session
          </button>
        )}
      </div>
      
      {/* Session Form Modal */}
      {showForm && (
        <div style={styles.modalOverlay} onClick={resetForm}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2>Log Study Session</h2>
              <button onClick={resetForm} style={styles.closeButton}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Subject *</label>
                <select
                  value={formData.subjectId}
                  onChange={e => setFormData({ ...formData, subjectId: e.target.value })}
                  style={styles.select}
                  required
                >
                  <option value="">Select a subject</option>
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                    style={styles.input}
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>Time</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={e => setFormData({ ...formData, time: e.target.value })}
                    style={styles.input}
                  />
                </div>
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Duration (minutes)</label>
                <select
                  value={formData.duration}
                  onChange={e => setFormData({ ...formData, duration: e.target.value })}
                  style={styles.select}
                >
                  <option value={25}>25 min</option>
                  <option value={30}>30 min</option>
                  <option value={45}>45 min</option>
                  <option value={50}>50 min</option>
                  <option value={60}>1 hour</option>
                  <option value={90}>1.5 hours</option>
                  <option value={120}>2 hours</option>
                </select>
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Productivity Rating</label>
                <div style={styles.ratingContainer}>
                  {[1, 2, 3, 4, 5].map(rating => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setFormData({ ...formData, productivity: rating })}
                      style={styles.ratingButton}
                    >
                      <Star 
                        size={24} 
                        fill={rating <= formData.productivity ? '#EAB308' : 'none'}
                        color={rating <= formData.productivity ? '#EAB308' : 'var(--text-muted)'}
                      />
                    </button>
                  ))}
                </div>
                <span style={styles.ratingLabel}>
                  {formData.productivity === 1 && 'Very Low'}
                  {formData.productivity === 2 && 'Low'}
                  {formData.productivity === 3 && 'Average'}
                  {formData.productivity === 4 && 'Good'}
                  {formData.productivity === 5 && 'Excellent'}
                </span>
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Notes (Optional)</label>
                <textarea
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="What did you learn? Any challenges?"
                  style={styles.textarea}
                  rows={3}
                />
              </div>
              
              <div style={styles.formActions}>
                <button type="button" onClick={resetForm} style={styles.cancelButton}>
                  Cancel
                </button>
                <button type="submit" style={styles.submitButton}>
                  Log Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Sessions List */}
      {sessions.length > 0 ? (
        <div style={styles.sessionsList}>
          {Object.entries(groupedSessions).map(([dateKey, dateSessions]) => (
            <div key={dateKey} style={styles.dateGroup}>
              <div style={styles.dateHeader}>
                <Calendar size={16} />
                <span style={styles.dateLabel}>
                  {format(new Date(dateKey), 'EEEE, MMM d')}
                </span>
                <span style={styles.dateTotal}>
                  {Math.round(dateSessions.reduce((sum, s) => sum + s.duration, 0) / 60 * 10) / 10}h
                </span>
              </div>
              
              <div style={styles.dateSessions}>
                {dateSessions.map(session => (
                  <div key={session.id} style={styles.sessionCard}>
                    <div style={styles.sessionColor} style={{ backgroundColor: getSubjectColor(session.subjectId) }} />
                    <div style={styles.sessionInfo}>
                      <div style={styles.sessionHeader}>
                        <span style={styles.sessionSubject}>
                          {getSubjectName(session.subjectId)}
                        </span>
                        <span style={styles.sessionTime}>
                          {format(new Date(session.date), 'h:mm a')}
                        </span>
                      </div>
                      <div style={styles.sessionStats}>
                        <div style={styles.sessionStat}>
                          <Clock size={14} />
                          <span>{session.duration} min</span>
                        </div>
                        <div style={styles.sessionStat}>
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star
                              key={star}
                              size={14}
                              fill={star <= session.productivity ? '#EAB308' : 'none'}
                              color={star <= session.productivity ? '#EAB308' : 'var(--text-muted)'}
                            />
                          ))}
                        </div>
                      </div>
                      {session.notes && (
                        <p style={styles.sessionNotes}>{session.notes}</p>
                      )}
                    </div>
                    <button 
                      onClick={() => handleDelete(session.id)}
                      style={styles.deleteButton}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={styles.emptyState}>
          <Clock size={48} />
          <h3>No sessions logged</h3>
          <p>Start logging your study sessions to help AI learn your patterns</p>
          {subjects.length > 0 ? (
            <button onClick={() => setShowForm(true)} style={styles.emptyButton}>
              <Plus size={18} />
              Log Your First Session
            </button>
          ) : (
            <p style={styles.emptyHint}>Add subjects first to log sessions</p>
          )}
        </div>
      )}
    </div>
  )
}

const styles = {
  page: {
    padding: '32px',
    marginLeft: '240px',
    maxWidth: '900px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '32px',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 700,
    marginBottom: '4px',
  },
  subtitle: {
    color: 'var(--text-muted)',
  },
  addButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    background: 'linear-gradient(135deg, var(--primary), #00B88A)',
    color: 'var(--bg-dark)',
    borderRadius: 'var(--radius-md)',
    fontWeight: 600,
    fontSize: '0.9375rem',
  },
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  modalContent: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-xl)',
    padding: '32px',
    width: '90%',
    maxWidth: '480px',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  closeButton: {
    background: 'transparent',
    color: 'var(--text-secondary)',
    padding: '8px',
    borderRadius: 'var(--radius-md)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: 'var(--text-secondary)',
  },
  input: {
    padding: '12px 16px',
    background: 'var(--surface-light)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--text-primary)',
    fontSize: '0.9375rem',
  },
  select: {
    padding: '12px 16px',
    background: 'var(--surface-light)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--text-primary)',
    fontSize: '0.9375rem',
    cursor: 'pointer',
  },
  textarea: {
    padding: '12px 16px',
    background: 'var(--surface-light)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--text-primary)',
    fontSize: '0.9375rem',
    resize: 'vertical',
    minHeight: '80px',
  },
  ratingContainer: {
    display: 'flex',
    gap: '4px',
  },
  ratingButton: {
    background: 'transparent',
    padding: '4px',
  },
  ratingLabel: {
    fontSize: '0.875rem',
    color: 'var(--text-muted)',
    marginTop: '4px',
  },
  formActions: {
    display: 'flex',
    gap: '12px',
    marginTop: '8px',
  },
  cancelButton: {
    flex: 1,
    padding: '12px 20px',
    background: 'var(--surface-light)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--text-secondary)',
    fontWeight: 500,
  },
  submitButton: {
    flex: 1,
    padding: '12px 20px',
    background: 'linear-gradient(135deg, var(--primary), #00B88A)',
    color: 'var(--bg-dark)',
    borderRadius: 'var(--radius-md)',
    fontWeight: 600,
  },
  sessionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  dateGroup: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
  },
  dateHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '16px 20px',
    background: 'var(--surface-light)',
    borderBottom: '1px solid var(--border)',
  },
  dateLabel: {
    fontWeight: 600,
    flex: 1,
  },
  dateTotal: {
    fontSize: '0.875rem',
    color: 'var(--primary)',
    fontWeight: 600,
  },
  dateSessions: {
    display: 'flex',
    flexDirection: 'column',
  },
  sessionCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
    padding: '16px 20px',
    borderBottom: '1px solid var(--border)',
  },
  sessionColor: {
    width: '4px',
    height: '100%',
    minHeight: '40px',
    borderRadius: '2px',
    flexShrink: 0,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  sessionSubject: {
    fontWeight: 600,
  },
  sessionTime: {
    fontSize: '0.875rem',
    color: 'var(--text-muted)',
  },
  sessionStats: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  sessionStat: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.875rem',
    color: 'var(--text-secondary)',
  },
  sessionNotes: {
    marginTop: '8px',
    fontSize: '0.875rem',
    color: 'var(--text-muted)',
    fontStyle: 'italic',
  },
  deleteButton: {
    background: 'transparent',
    color: 'var(--text-muted)',
    padding: '8px',
    borderRadius: 'var(--radius-md)',
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
  emptyButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '20px',
    padding: '12px 24px',
    background: 'var(--primary-dim)',
    color: 'var(--primary)',
    borderRadius: 'var(--radius-md)',
    fontWeight: 600,
  },
  emptyHint: {
    marginTop: '20px',
    fontSize: '0.875rem',
  },
}
