import { 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  format, 
  addDays,
  differenceInDays,
  isSameDay,
  parseISO,
  isWeekend,
} from 'date-fns'

// Difficulty weights for scoring
const DIFFICULTY_WEIGHTS = {
  easy: 1,
  medium: 1.5,
  hard: 2,
}

// Time slot configurations
const TIME_SLOTS = {
  morning: { start: 8, end: 12, label: 'Morning' },
  afternoon: { start: 12, end: 17, label: 'Afternoon' },
  evening: { start: 17, end: 21, label: 'Evening' },
}

/**
 * Calculates urgency score for a subject based on deadline proximity
 * and target hours vs actual hours
 */
function calculateUrgencyScore(subject, sessions, weekStart) {
  const subjectSessions = sessions.filter(
    s => s.subjectId === subject.id && new Date(s.date) >= weekStart
  )
  
  const actualHours = subjectSessions.reduce((sum, s) => sum + (s.duration || 0), 0) / 60
  const targetHours = subject.targetHours || 10
  const hoursDeficit = Math.max(0, targetHours - actualHours)
  
  // Deadline proximity score (0-100)
  let deadlineScore = 0
  if (subject.deadline) {
    const deadline = new Date(subject.deadline)
    const daysUntil = differenceInDays(deadline, weekStart)
    
    if (daysUntil <= 0) deadlineScore = 100
    else if (daysUntil <= 2) deadlineScore = 80
    else if (daysUntil <= 7) deadlineScore = 60
    else if (daysUntil <= 14) deadlineScore = 40
    else deadlineScore = 20
  }
  
  // Consistency score (lower consistency = higher boost needed)
  const consistencyScore = calculateConsistencyScore(subjectSessions)
  const consistencyBoost = (100 - consistencyScore) * 0.3
  
  // Combine: hours deficit (0-40) + deadline (0-60) + consistency boost
  const urgencyScore = (hoursDeficit / targetHours) * 40 + deadlineScore + consistencyBoost
  
  return Math.min(100, urgencyScore)
}

/**
 * Calculate consistency score based on study history
 */
function calculateConsistencyScore(sessions) {
  if (!sessions.length) return 50 // Default中等一致性
  
  const dailyCounts = {}
  sessions.forEach(session => {
    const day = format(new Date(session.date), 'yyyy-MM-dd')
    dailyCounts[day] = (dailyCounts[day] || 0) + 1
  })
  
  const daysStudied = Object.keys(dailyCounts).length
  const maxDays = 7 // 一周最多7天
  const consistencyScore = (daysStudied / maxDays) * 100
  
  return consistencyScore
}

/**
 * Get historical productivity by time of day
 */
function analyzePeakHours(sessions) {
  if (!sessions.length) return 'morning'
  
  const timeSlotProductivity = {
    morning: { total: 0, count: 0 },
    afternoon: { total: 0, count: 0 },
    evening: { total: 0, count: 0 },
  }
  
  sessions.forEach(session => {
    const hour = new Date(session.date).getHours()
    let slot = 'morning'
    if (hour >= 12 && hour < 17) slot = 'afternoon'
    else if (hour >= 17) slot = 'evening'
    
    timeSlotProductivity[slot].total += session.productivity || 3
    timeSlotProductivity[slot].count += 1
  })
  
  let bestSlot = 'morning'
  let bestAvg = 0
  
  Object.entries(timeSlotProductivity).forEach(([slot, data]) => {
    if (data.count > 0) {
      const avg = data.total / data.count
      if (avg > bestAvg) {
        bestAvg = avg
        bestSlot = slot
      }
    }
  })
  
  return bestSlot
}

/**
 * Calculate productivity rating for each subject
 */
function calculateSubjectProductivity(subjectId, sessions) {
  const subjectSessions = sessions.filter(s => s.subjectId === subjectId)
  
  if (!subjectSessions.length) return 3 // Default中等生产力
  
  const totalProductivity = subjectSessions.reduce(
    (sum, s) => sum + (s.productivity || 3), 
    0
  )
  
  return totalProductivity / subjectSessions.length
}

/**
 * Main AI load balancer algorithm
 */
export function generateWeeklyPlan(subjects, sessions, settings) {
  if (!subjects.length) return []
  
  const now = new Date()
  const weekStart = startOfWeek(now, { weekStartsOn: 1 }) // Monday
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 }) // Sunday
  
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd })
  
  // Calculate urgency scores for all subjects
  const subjectScores = subjects.map(subject => ({
    ...subject,
    urgencyScore: calculateUrgencyScore(subject, sessions, weekStart),
    difficultyWeight: DIFFICULTY_WEIGHTS[subject.difficulty] || 1,
    productivity: calculateSubjectProductivity(subject.id, sessions),
  }))
  
  // Sort by urgency score (highest first)
  subjectScores.sort((a, b) => b.urgencyScore - a.urgencyScore)
  
  // Get user's peak hours from history or settings
  const peakHours = analyzePeakHours(sessions) || settings.peakHours
  
  // Generate plan
  const plan = []
  const dailyHours = {} // Track hours per day
  const dailyDifficultHours = {} // Track difficult subject hours per day
  
  // Initialize daily tracking
  days.forEach(day => {
    const dayKey = format(day, 'yyyy-MM-dd')
    dailyHours[dayKey] = 0
    dailyDifficultHours[dayKey] = 0
  })
  
  // Calculate total hours needed per week
  const totalTargetHours = subjects.reduce(
    (sum, s) => sum + (s.targetHours || 10), 
    0
  )
  const availableHours = settings.dailyLimit * 7
  
  // Distribute subjects across the week
  subjectScores.forEach(subject => {
    const targetHours = subject.targetHours || 10
    const hoursneeded = Math.min(targetHours, availableHours / subjects.length)
    const sessionDuration = 50 // 50 minutes per session
    const sessionsNeeded = Math.ceil((hoursneeded * 60) / sessionDuration)
    
    // Determine best days for this subject
    let subjectDays = getBestDaysForSubject(
      subject, 
      days, 
      dailyHours, 
      dailyDifficultHours, 
      peakHours,
      settings.restDays
    )
    
    // Create sessions for this subject
    let hoursAssigned = 0
    subjectDays.forEach((day, dayIndex) => {
      if (hoursAssigned >= hoursneeded) return
      
      const dayKey = format(day, 'yyyy-MM-dd')
      const currentDayHours = dailyHours[dayKey] || 0
      
      // Check if we can add more sessions today
      if (currentDayHours >= settings.dailyLimit) return
      
      // Check if difficult subjects limit reached
      const isDifficult = subject.difficulty === 'hard'
      if (isDifficult && (dailyDifficultHours[dayKey] || 0) >= 2) return
      
      // Add session
      const timeSlot = getBestTimeSlot(
        day, 
        dayIndex, 
        peakHours, 
        settings.breakDuration
      )
      
      plan.push({
        id: `${subject.id}-${dayKey}-${timeSlot}`,
        subjectId: subject.id,
        subjectName: subject.name,
        subjectColor: subject.color,
        date: dayKey,
        timeSlot,
        duration: sessionDuration,
        difficulty: subject.difficulty,
        isAISuggested: true,
      })
      
      hoursAssigned += sessionDuration / 60
      dailyHours[dayKey] = currentDayHours + (sessionDuration / 60)
      
      if (isDifficult) {
        dailyDifficultHours[dayKey] = (dailyDifficultHours[dayKey] || 0) + (sessionDuration / 60)
      }
    })
  })
  
  // Sort plan by date and time
  plan.sort((a, b) => {
    const dateCompare = a.date.localeCompare(b.date)
    if (dateCompare !== 0) return dateCompare
    return a.timeSlot.localeCompare(b.timeSlot)
  })
  
  return plan
}

/**
 * Get best days to study each subject
 */
function getBestDaysForSubject(subject, days, dailyHours, dailyDifficultHours, peakHours, restDays) {
  const suitableDays = days.filter(day => {
    const dayKey = format(day, 'yyyy-MM-dd')
    const dayOfWeek = day.getDay()
    
    // Skip rest days
    if (restDays.includes(dayOfWeek)) return false
    
    // Check daily hour limit
    if (dailyHours[dayKey] >= 6) return false
    
    return true
  })
  
  // If subject has a deadline, prioritize days before deadline
  if (subject.deadline) {
    const deadline = new Date(subject.deadline)
    const daysBeforeDeadline = suitableDays.filter(
      d => d <= deadline
    )
    if (daysBeforeDeadline.length > 0) {
      return daysBeforeDeadline.slice(0, 3) // Prioritize 3 days before deadline
    }
  }
  
  return suitableDays.slice(0, 4) // Max 4 days per subject per week
}

/**
 * Get best time slot for a study session
 */
function getBestTimeSlot(day, dayIndex, peakHours, breakDuration) {
  // First session of the day at peak hours if available
  if (dayIndex === 0) {
    return peakHours
  }
  
  const hour = day.getHours()
  const isMorning = hour < 12
  
  // Alternate between time blocks for variety
  const slots = ['morning', 'afternoon', 'evening']
  const preferredIndex = slots.indexOf(peakHours)
  const alternateIndex = (preferredIndex + dayIndex) % 3
  
  return slots[alternateIndex]
}

/**
 * Get statistics for dashboard
 */
export function getStudyStats(subjects, sessions) {
  const now = new Date()
  const weekStart = startOfWeek(now, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 })
  
  // This week's sessions
  const thisWeekSessions = sessions.filter(s => {
    const sessionDate = new Date(s.date)
    return sessionDate >= weekStart && sessionDate <= weekEnd
  })
  
  // Total hours this week
  const weeklyHours = thisWeekSessions.reduce(
    (sum, s) => sum + (s.duration || 0) / 60, 
    0
  )
  
  // Study streak
  const streak = calculateStreak(sessions)
  
  // Subjects being studied
  const activeSubjects = [...new Set(thisWeekSessions.map(s => s.subjectId))].length
  
  // Average productivity
  const avgProductivity = thisWeekSessions.length
    ? thisWeekSessions.reduce((sum, s) => sum + (s.productivity || 3), 0) / thisWeekSessions.length
    : 0
  
  // Weekly goal completion
  const totalTarget = subjects.reduce((sum, s) => sum + (s.targetHours || 10), 0)
  const goalCompletion = totalTarget > 0 
    ? Math.min(100, Math.round((weeklyHours / totalTarget) * 100))
    : 0
  
  return {
    weeklyHours: Math.round(weeklyHours * 10) / 10,
    streak,
    activeSubjects,
    avgProductivity: Math.round(avgProductivity * 10) / 10,
    goalCompletion,
    sessionsCount: thisWeekSessions.length,
  }
}

/**
 * Calculate study streak
 */
function calculateStreak(sessions) {
  if (!sessions.length) return 0
  
  const uniqueDays = [...new Set(sessions.map(s => format(new Date(s.date), 'yyyy-MM-dd')))].sort()
  
  let streak = 0
  let currentDate = new Date()
  currentDate.setHours(0, 0, 0, 0)
  
  // Check if studied today
  const todayStr = format(currentDate, 'yyyy-MM-dd')
  const studiedToday = uniqueDays.includes(todayStr)
  
  if (!studiedToday) {
    // Check yesterday
    currentDate = addDays(currentDate, -1)
  }
  
  // Count consecutive days
  while (uniqueDays.includes(format(currentDate, 'yyyy-MM-dd'))) {
    streak++
    currentDate = addDays(currentDate, -1)
  }
  
  return streak
}

/**
 * Get weekly hours by day for chart
 */
export function getWeeklyChartData(sessions) {
  const now = new Date()
  const weekStart = startOfWeek(now, { weekStartsOn: 1 })
  
  const days = eachDayOfInterval({ start: weekStart, end: addDays(weekStart, 6) })
  
  return days.map(day => {
    const dayStr = format(day, 'yyyy-MM-dd')
    const daySessions = sessions.filter(
      s => format(new Date(s.date), 'yyyy-MM-dd') === dayStr
    )
    
    const hours = daySessions.reduce((sum, s) => sum + (s.duration || 0) / 60, 0)
    
    return {
      day: format(day, 'EEE'),
      hours: Math.round(hours * 10) / 10,
    }
  })
}

/**
 * Get subject distribution for chart
 */
export function getSubjectDistribution(subjects, sessions) {
  const now = new Date()
  const weekStart = startOfWeek(now, { weekStartsOn: 1 })
  
  const subjectHours = {}
  
  sessions.forEach(session => {
    if (new Date(session.date) >= weekStart) {
      const subject = subjects.find(s => s.id === session.subjectId)
      if (subject) {
        const name = subject.name
        subjectHours[name] = (subjectHours[name] || 0) + (session.duration || 0) / 60
      }
    }
  })
  
  return Object.entries(subjectHours).map(([name, hours]) => ({
    name,
    value: Math.round(hours * 10) / 10,
  }))
}
