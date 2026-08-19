import React, { useState, useEffect } from 'react'
import { useStudy } from '../context/StudyContext'
import { Settings as SettingsIcon, Sun, Moon, Clock, Coffee, Save, RotateCcw } from 'lucide-react'

export default function Settings() {
  const { state, dispatch } = useStudy()
  const { settings } = state
  
  const [formData, setFormData] = useState(settings)
  const [saved, setSaved] = useState(false)
  
  useEffect(() => {
    setFormData(settings)
  }, [settings])
  
  const handleSave = () => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: formData })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }
  
  const handleReset = () => {
    setFormData({
      dailyLimit: 6,
      peakHours: 'morning',
      breakDuration: 15,
      restDays: [6],
    })
  }
  
  const toggleRestDay = (day) => {
    const newRestDays = formData.restDays.includes(day)
      ? formData.restDays.filter(d => d !== day)
      : [...formData.restDays, day]
    setFormData({ ...formData, restDays: newRestDays })
  }
  
  const DAYS = [
    { value: 0, label: 'Sun' },
    { value: 1, label: 'Mon' },
    { value: 2, label: 'Tue' },
    { value: 3, label: 'Wed' },
    { value: 4, label: 'Thu' },
    { value: 5, label: 'Fri' },
    { value: 6, label: 'Sat' },
  ]
  
  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Settings</h1>
          <p style={styles.subtitle}>Customize your study preferences</p>
        </div>
      </div>
      
      <div style={styles.settingsGrid}>
        {/* Daily Study Limit */}
        <div style={styles.settingCard}>
          <div style={styles.settingHeader}>
            <div style={styles.settingIcon}>
              <Clock size={20} />
            </div>
            <div>
              <h3>Daily Study Limit</h3>
              <p>Maximum study hours per day</p>
            </div>
          </div>
          <div style={styles.settingContent}>
            <div style={styles.limitButtons}>
              {[4, 5, 6, 7, 8, 10].map(hours => (
                <button
                  key={hours}
                  onClick={() => setFormData({ ...formData, dailyLimit: hours })}
                  style={{
                    ...styles.limitButton,
                    ...(formData.dailyLimit === hours ? styles.limitButtonActive : {}),
                  }}
                >
                  {hours}h
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Peak Hours */}
        <div style={styles.settingCard}>
          <div style={styles.settingHeader}>
            <div style={{...styles.settingIcon, background: 'var(--secondary-dim)', color: 'var(--secondary)'}}>
              <Sun size={20} />
            </div>
            <div>
              <h3>Peak Productivity Hours</h3>
              <p>When are you most productive?</p>
            </div>
          </div>
          <div style={styles.settingContent}>
            <div style={styles.peakButtons}>
              {[
                { value: 'morning', label: 'Morning', icon: Sun },
                { value: 'afternoon', label: 'Afternoon', icon: Sun },
                { value: 'evening', label: 'Evening', icon: Moon },
              ].map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setFormData({ ...formData, peakHours: value })}
                  style={{
                    ...styles.peakButton,
                    ...(formData.peakHours === value ? styles.peakButtonActive : {}),
                  }}
                >
                  <Icon size={18} />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Break Duration */}
        <div style={styles.settingCard}>
          <div style={styles.settingHeader}>
            <div style={{...styles.settingIcon, background: 'var(--accent-dim)', color: 'var(--accent)'}}>
              <Coffee size={20} />
            </div>
            <div>
              <h3>Break Duration</h3>
              <p>Time between study sessions</p>
            </div>
          </div>
          <div style={styles.settingContent}>
            <div style={styles.breakButtons}>
              {[5, 10, 15, 20, 30].map(min => (
                <button
                  key={min}
                  onClick={() => setFormData({ ...formData, breakDuration: min })}
                  style={{
                    ...styles.breakButton,
                    ...(formData.breakDuration === min ? styles.breakButtonActive : {}),
                  }}
                >
                  {min}m
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Rest Days */}
        <div style={styles.settingCard}>
          <div style={styles.settingHeader}>
            <div style={{...styles.settingIcon, background: 'rgba(34, 197, 94, 0.15)', color: 'var(--success)'}}>
              <Coffee size={20} />
            </div>
            <div>
              <h3>Rest Days</h3>
              <p>Days you prefer to rest</p>
            </div>
          </div>
          <div style={styles.settingContent}>
            <div style={styles.restDays}>
              {DAYS.map(day => (
                <button
                  key={day.value}
                  onClick={() => toggleRestDay(day.value)}
                  style={{
                    ...styles.restDayButton,
                    ...(formData.restDays.includes(day.value) ? styles.restDayButtonActive : {}),
                  }}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Actions */}
      <div style={styles.actions}>
        <button onClick={handleReset} style={styles.resetButton}>
          <RotateCcw size={18} />
          Reset to Defaults
        </button>
        <button onClick={handleSave} style={styles.saveButton}>
          <Save size={18} />
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>
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
  settingsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    marginBottom: '32px',
  },
  settingCard: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '24px',
  },
  settingHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
    marginBottom: '20px',
  },
  settingIcon: {
    width: '44px',
    height: '44px',
    borderRadius: 'var(--radius-md)',
    background: 'var(--primary-dim)',
    color: 'var(--primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  settingContent: {},
  limitButtons: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  limitButton: {
    padding: '10px 20px',
    background: 'var(--surface-light)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--text-secondary)',
    fontWeight: 500,
    fontSize: '0.9375rem',
  },
  limitButtonActive: {
    background: 'var(--primary-dim)',
    border: '1px solid var(--primary)',
    color: 'var(--primary)',
  },
  peakButtons: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '8px',
  },
  peakButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px 16px',
    background: 'var(--surface-light)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--text-secondary)',
    fontWeight: 500,
  },
  peakButtonActive: {
    background: 'var(--secondary-dim)',
    border: '1px solid var(--secondary)',
    color: 'var(--secondary)',
  },
  breakButtons: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  breakButton: {
    padding: '10px 20px',
    background: 'var(--surface-light)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--text-secondary)',
    fontWeight: 500,
  },
  breakButtonActive: {
    background: 'var(--accent-dim)',
    border: '1px solid var(--accent)',
    color: 'var(--accent)',
  },
  restDays: {
    display: 'flex',
    gap: '8px',
  },
  restDayButton: {
    width: '48px',
    padding: '10px 8px',
    background: 'var(--surface-light)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--text-secondary)',
    fontWeight: 500,
    fontSize: '0.875rem',
  },
  restDayButtonActive: {
    background: 'rgba(34, 197, 94, 0.15)',
    border: '1px solid var(--success)',
    color: 'var(--success)',
  },
  actions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
  },
  resetButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    background: 'var(--surface-light)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--text-secondary)',
    fontWeight: 500,
  },
  saveButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    background: 'linear-gradient(135deg, var(--primary), #00B88A)',
    color: 'var(--bg-dark)',
    borderRadius: 'var(--radius-md)',
    fontWeight: 600,
  },
}
