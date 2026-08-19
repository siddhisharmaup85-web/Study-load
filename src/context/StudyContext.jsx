import React, { createContext, useContext, useReducer, useEffect } from 'react'

const StudyContext = createContext()

const initialState = {
  subjects: [],
  sessions: [],
  weeklyPlan: [],
  settings: {
    dailyLimit: 6,
    peakHours: 'morning',
    breakDuration: 15,
    restDays: [6],
  },
  currentPage: 'dashboard',
}

function loadFromStorage(key) {
  try {
    const data = localStorage.getItem(`study_${key}`)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(`study_${key}`, JSON.stringify(value))
  } catch (e) {
    console.error('Storage error:', e)
  }
}

function studyReducer(state, action) {
  switch (action.type) {
    case 'SET_PAGE':
      return { ...state, currentPage: action.payload }
    
    case 'ADD_SUBJECT':
      const newSubject = { ...action.payload, id: Date.now().toString() }
      return { ...state, subjects: [...state.subjects, newSubject] }
    
    case 'UPDATE_SUBJECT':
      return {
        ...state,
        subjects: state.subjects.map(s => 
          s.id === action.payload.id ? action.payload : s
        ),
      }
    
    case 'DELETE_SUBJECT':
      return {
        ...state,
        subjects: state.subjects.filter(s => s.id !== action.payload),
      }
    
    case 'ADD_SESSION':
      const newSession = { ...action.payload, id: Date.now().toString() }
      return { ...state, sessions: [...state.sessions, newSession] }
    
    case 'DELETE_SESSION':
      return {
        ...state,
        sessions: state.sessions.filter(s => s.id !== action.payload),
      }
    
    case 'SET_WEEKLY_PLAN':
      return { ...state, weeklyPlan: action.payload }
    
    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } }
    
    case 'LOAD_DATA':
      return { ...state, ...action.payload }
    
    default:
      return state
  }
}

export function StudyProvider({ children }) {
  const [state, dispatch] = useReducer(studyReducer, initialState)

  useEffect(() => {
    const subjects = loadFromStorage('subjects') || []
    const sessions = loadFromStorage('sessions') || []
    const settings = loadFromStorage('settings') || initialState.settings
    const weeklyPlan = loadFromStorage('weeklyPlan') || []
    
    if (subjects.length || sessions.length) {
      dispatch({
        type: 'LOAD_DATA',
        payload: { subjects, sessions, settings, weeklyPlan },
      })
    }
  }, [])

  useEffect(() => {
    saveToStorage('subjects', state.subjects)
    saveToStorage('sessions', state.sessions)
    saveToStorage('settings', state.settings)
    saveToStorage('weeklyPlan', state.weeklyPlan)
  }, [state.subjects, state.sessions, state.settings, state.weeklyPlan])

  return (
    <StudyContext.Provider value={{ state, dispatch }}>
      {children}
    </StudyContext.Provider>
  )
}

export function useStudy() {
  const context = useContext(StudyContext)
  if (!context) {
    throw new Error('useStudy must be used within a StudyProvider')
  }
  return context
}

export default StudyContext
