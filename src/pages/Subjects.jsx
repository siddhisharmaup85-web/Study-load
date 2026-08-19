import React, { useState } from 'react'
import { useStudy } from '../context/StudyContext'
import { Plus, Trash2, Edit2, X, BookOpen, Calendar, Clock } from 'lucide-react'
import { format, differenceInDays } from 'date-fns'

const SUBJECT_COLORS = [
  '#00D9A5', '#8B5CF6', '#F97316', '#3B82F6', '#EC4899', 
  '#EAB308', '#22C55E', '#EF4444', '#06B6D4', '#84CC16'
]

export default function Subjects() {
  const { state, dispatch } = useStudy()
  const { subjects } = state
  
  const [showForm, setShowForm] = useState(false)
  const [editingSubject, setEditingSubject] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    color: SUBJECT_COLORS[0],
    difficulty: 'medium',
    targetHours: 10,
    deadline: '',
  })
  
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name.trim()) return
    
    if (editingSubject) {
      dispatch({
        type: 'UPDATE_SUBJECT',
        payload: { ...editingSubject, ...formData },
      })
    } else {
      dispatch({
        type: 'ADD_SUBJECT',
        payload: { ...formData, targetHours: parseInt(formData.targetHours) },
      })
    }
    
    resetForm()
  }
  
  const resetForm = () => {
    setShowForm(false)
    setEditingSubject(null)
    setFormData({
      name: '',
      color: SUBJECT_COLORS[0],
      difficulty: 'medium',
      targetHours: 10,
      deadline: '',
    })
  }
  
  const handleEdit = (subject) => {
    setEditingSubject(subject)
    setFormData({
      name: subject.name,
      color: subject.color,
      difficulty: subject.difficulty,
      targetHours: subject.targetHours,
      deadline: subject.deadline || '',
    })
    setShowForm(true)
  }
  
  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this subject?')) {
      dispatch({ type: 'DELETE_SUBJECT', payload: id })
    }
  }
  
  const getDaysUntilDeadline = (deadline) => {
    if (!deadline) return null
    const days = differenceInDays(new Date(deadline), new Date())
    if (days < 0) return 'Overdue'
    if (days === 0) return 'Today'
    if (days === 1) return 'Tomorrow'
    return `${days} days`
  }
  
  const getDeadlineColor = (deadline) => {
    if (!deadline) return 'var(--text-muted)'
    const days = differenceInDays(new Date(deadline), new Date())
    if (days < 0) return 'var(--error)'
    if (days <= 2) return 'var(--error)'
    if (days <= 7) return 'var(--warning)'
    return 'var(--success)'
  }
  
  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Subjects</h1>
          <p style={styles.subtitle}>Manage your study subjects and goals</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          style={styles.addButton}
        >
          <Plus size={18} />
          Add Subject
        </button>
      </div>
      
      {/* Subject Form Modal */}
      {showForm && (
        <div style={styles.modalOverlay} onClick={resetForm}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2>{editingSubject ? 'Edit Subject' : 'Add New Subject'}</h2>
              <button onClick={resetForm} style={styles.closeButton}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Subject Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Mathematics, Physics"
                  style={styles.input}
                  required
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Color</label>
                <div style={styles.colorPicker}>
                  {SUBJECT_COLORS.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, color })}
                      style={{
                        ...styles.colorOption,
                        background: color,
                        ...(formData.color === color ? styles.colorOptionActive : {}),
                      }}
                    />
                  ))}
                </div>
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Difficulty Level</label>
                <div style={styles.difficultyPicker}>
                  {['easy', 'medium', 'hard'].map(diff => (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => setFormData({ ...formData, difficulty: diff })}
                      style={{
                        ...styles.difficultyOption,
                        ...(formData.difficulty === diff ? styles[`difficulty${diff.charAt(0).toUpperCase() + diff.slice(1)}Active`] : {}),
                      }}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Weekly Target Hours</label>
                <input
                  type="number"
                  min="1"
                  max="40"
                  value={formData.targetHours}
                  onChange={e => setFormData({ ...formData, targetHours: e.target.value })}
                  style={styles.input}
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Upcoming Deadline (Optional)</label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                  style={styles.input}
                />
              </div>
              
              <div style={styles.formActions}>
                <button type="button" onClick={resetForm} style={styles.cancelButton}>
                  Cancel
                </button>
                <button type="submit" style={styles.submitButton}>
                  {editingSubject ? 'Save Changes' : 'Add Subject'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Subjects Grid */}
      {subjects.length > 0 ? (
        <div style={styles.subjectsGrid}>
          {subjects.map(subject => {
            const daysUntil = getDaysUntilDeadline(subject.deadline)
            const deadlineColor = getDeadlineColor(subject.deadline)
            
            return (
              <div key={subject.id} style={styles.subjectCard}>
                <div style={styles.cardHeader}>
                  <div style={styles.subjectInfo}>
                    <div style={{ ...styles.colorDot, background: subject.color }} />
                    <h3 style={styles.subjectName}>{subject.name}</h3>
                  </div>
                  <div style={styles.cardActions}>
                    <button 
                      onClick={() => handleEdit(subject)}
                      style={styles.actionButton}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(subject.id)}
                      style={{...styles.actionButton, color: 'var(--error)'}}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <div style={styles.cardBody}>
                  <div style={styles.cardStats}>
                    <div style={styles.cardStat}>
                      <Clock size={14} />
                      <span>{subject.targetHours}h/week</span>
                    </div>
                    <span style={{
                      ...styles.difficultyBadge,
                      background: subject.difficulty === 'hard' ? 'rgba(239, 68, 68, 0.15)' : 
                                  subject.difficulty === 'medium' ? 'rgba(234, 179, 8, 0.15)' : 'rgba(34, 197, 94, 0.15)',
                      color: subject.difficulty === 'hard' ? '#EF4444' : 
                             subject.difficulty === 'medium' ? '#EAB308' : '#22C55E',
                    }}>
                      {subject.difficulty}
                    </span>
                  </div>
                  
                  {subject.deadline && (
                    <div style={styles.deadlineInfo}>
                      <Calendar size={14} style={{ color: deadlineColor }} />
                      <span style={{ color: deadlineColor }}>
                        {daysUntil}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div style={styles.emptyState}>
          <BookOpen size={48} />
          <h3>No subjects yet</h3>
          <p>Add your study subjects to get started with AI-powered scheduling</p>
          <button onClick={() => setShowForm(true)} style={styles.emptyButton}>
            <Plus size={18} />
            Add Your First Subject
          </button>
        </div>
      )}
    </div>
  )
}

const styles = {
  page: {
    padding: '32px',
    marginLeft: '240px',
    maxWidth: '1200px',
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
  colorPicker: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  colorOption: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    border: '2px solid transparent',
    cursor: 'pointer',
    transition: 'all var(--transition-fast)',
  },
  colorOptionActive: {
    border: '2px solid var(--text-primary)',
    transform: 'scale(1.1)',
  },
  difficultyPicker: {
    display: 'flex',
    gap: '8px',
  },
  difficultyOption: {
    flex: 1,
    padding: '10px 16px',
    background: 'var(--surface-light)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--text-secondary)',
    fontSize: '0.9375rem',
    fontWeight: 500,
    textTransform: 'capitalize',
  },
  difficultyEasyActive: {
    background: 'rgba(34, 197, 94, 0.15)',
    border: '1px solid var(--success)',
    color: 'var(--success)',
  },
  difficultyMediumActive: {
    background: 'rgba(234, 179, 8, 0.15)',
    border: '1px solid var(--warning)',
    color: 'var(--warning)',
  },
  difficultyHardActive: {
    background: 'rgba(239, 68, 68, 0.15)',
    border: '1px solid var(--error)',
    color: 'var(--error)',
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
  subjectsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  subjectCard: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '20px',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px',
  },
  subjectInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  colorDot: {
    width: '16px',
    height: '16px',
    borderRadius: '50%',
  },
  subjectName: {
    fontSize: '1.125rem',
    fontWeight: 600,
  },
  cardActions: {
    display: 'flex',
    gap: '4px',
  },
  actionButton: {
    background: 'transparent',
    color: 'var(--text-secondary)',
    padding: '8px',
    borderRadius: 'var(--radius-md)',
  },
  cardBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  cardStats: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardStat: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: 'var(--text-secondary)',
    fontSize: '0.9375rem',
  },
  difficultyBadge: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'capitalize',
  },
  deadlineInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.875rem',
    paddingTop: '8px',
    borderTop: '1px solid var(--border)',
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
}
