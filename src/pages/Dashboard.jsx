import React, { useMemo } from 'react'
import { useStudy } from '../context/StudyContext'
import { getStudyStats, getWeeklyChartData, getSubjectDistribution, generateWeeklyPlan } from '../utils/aiBalancer'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { Flame, Clock, BookOpen, Target, TrendingUp, Sparkles } from 'lucide-react'

const COLORS = ['#00D9A5', '#8B5CF6', '#F97316', '#3B82F6', '#EC4899', '#EAB308']

export default function Dashboard() {
  const { state, dispatch } = useStudy()
  const { subjects, sessions, settings } = state
  
  const stats = useMemo(() => getStudyStats(subjects, sessions), [subjects, sessions])
  const weeklyData = useMemo(() => getWeeklyChartData(sessions), [sessions])
  const subjectDist = useMemo(() => getSubjectDistribution(subjects, sessions), [subjects, sessions])
  
  // Generate quick plan suggestion
  const planSuggestion = useMemo(() => {
    if (subjects.length === 0) return null
    return generateWeeklyPlan(subjects.slice(0, 3), sessions, settings)
  }, [subjects, sessions, settings])
  
  return (
    <div className="page max-w-7xl mx-auto">
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Dashboard</h1>
          <p style={styles.subtitle}>Track your study progress and stay balanced</p>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>
            <Flame size={20} />
          </div>
          <div style={styles.statContent}>
            <span style={styles.statValue}>{stats.streak}</span>
            <span style={styles.statLabel}>Day Streak</span>
          </div>
        </div>
        
        <div style={styles.statCard}>
          <div style={{...styles.statIcon, background: 'var(--secondary-dim)', color: 'var(--secondary)'}}>
            <Clock size={20} />
          </div>
          <div style={styles.statContent}>
            <span style={styles.statValue}>{stats.weeklyHours}h</span>
            <span style={styles.statLabel}>This Week</span>
          </div>
        </div>
        
        <div style={styles.statCard}>
          <div style={{...styles.statIcon, background: 'var(--accent-dim)', color: 'var(--accent)'}}>
            <BookOpen size={20} />
          </div>
          <div style={styles.statContent}>
            <span style={styles.statValue}>{stats.activeSubjects}</span>
            <span style={styles.statLabel}>Subjects</span>
          </div>
        </div>
        
        <div style={styles.statCard}>
          <div style={{...styles.statIcon, background: 'rgba(234, 179, 8, 0.15)', color: 'var(--warning)'}}>
            <Target size={20} />
          </div>
          <div style={styles.statContent}>
            <span style={styles.statValue}>{stats.goalCompletion}%</span>
            <span style={styles.statLabel}>Weekly Goal</span>
          </div>
        </div>
      </div>
      
      {/* Charts Section */}
      <div style={styles.chartsGrid}>
        {/* Weekly Hours Chart */}
        <div style={styles.chartCard}>
          <div style={styles.chartHeader}>
            <h3>Weekly Study Hours</h3>
            <span style={styles.chartLabel}>Hours per day</span>
          </div>
          {weeklyData.length > 0 && weeklyData.some(d => d.hours > 0) ? (
            <div style={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis 
                    dataKey="day" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#8B949E', fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#8B949E', fontSize: 12 }}
                    tickFormatter={(v) => `${v}h`}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#21262D',
                      border: '1px solid #30363D',
                      borderRadius: '8px',
                      color: '#E6EDF3',
                    }}
                    formatter={(value) => [`${value}h`, 'Hours']}
                  />
                  <Bar dataKey="hours" fill="#00D9A5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div style={styles.emptyChart}>
              <Clock size={32} />
              <p>Start logging sessions to see your progress</p>
            </div>
          )}
        </div>
        
        {/* Subject Distribution */}
        <div style={styles.chartCard}>
          <div style={styles.chartHeader}>
            <h3>Subject Distribution</h3>
            <span style={styles.chartLabel}>Time spent per subject</span>
          </div>
          {subjectDist.length > 0 ? (
            <div style={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={subjectDist}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {subjectDist.map((entry, index) => (
                      <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: '#21262D',
                      border: '1px solid #30363D',
                      borderRadius: '8px',
                      color: '#E6EDF3',
                    }}
                    formatter={(value) => [`${value}h`, 'Hours']}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div style={styles.legend}>
                {subjectDist.map((entry, index) => (
                  <div key={entry.name} style={styles.legendItem}>
                    <span style={{...styles.legendDot, background: COLORS[index % COLORS.length]}} />
                    <span style={styles.legendLabel}>{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={styles.emptyChart}>
              <BookOpen size={32} />
              <p>Add subjects to see distribution</p>
            </div>
          )}
        </div>
      </div>
      
      {/* AI Suggestion */}
      {subjects.length > 0 && (
        <div style={styles.suggestionCard}>
          <div style={styles.suggestionHeader}>
            <Sparkles size={18} style={{ color: 'var(--primary)' }} />
            <h3>AI Study Suggestion</h3>
          </div>
          <p style={styles.suggestionText}>
            Based on your subjects and deadlines, prioritize these subjects this week:
          </p>
          <div style={styles.suggestionList}>
            {subjects.slice(0, 3).map((subject, index) => (
              <div key={subject.id} style={styles.suggestionItem}>
                <span style={styles.suggestionRank}>#{index + 1}</span>
                <span 
                  style={{...styles.subjectDot, background: subject.color}} 
                />
                <span style={styles.subjectName}>{subject.name}</span>
                <span style={{...styles.difficultyBadge, 
                  background: subject.difficulty === 'hard' ? 'rgba(239, 68, 68, 0.15)' : 
                          subject.difficulty === 'medium' ? 'rgba(234, 179, 8, 0.15)' : 'rgba(34, 197, 94, 0.15)',
                  color: subject.difficulty === 'hard' ? '#EF4444' : 
                         subject.difficulty === 'medium' ? '#EAB308' : '#22C55E',
                }}>
                  {subject.difficulty}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
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
    marginBottom: '32px',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 700,
    marginBottom: '4px',
  },
  subtitle: {
    color: 'var(--text-muted)',
    fontSize: '1rem',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
    marginBottom: '32px',
  },
  statCard: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  statIcon: {
    width: '48px',
    height: '48px',
    borderRadius: 'var(--radius-md)',
    background: 'var(--primary-dim)',
    color: 'var(--primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statContent: {
    display: 'flex',
    flexDirection: 'column',
  },
  statValue: {
    fontSize: '1.75rem',
    fontWeight: 700,
    fontFamily: 'var(--font-heading)',
    lineHeight: 1.2,
  },
  statLabel: {
    fontSize: '0.875rem',
    color: 'var(--text-muted)',
  },
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px',
    marginBottom: '32px',
  },
  chartCard: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '24px',
  },
  chartHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  chartLabel: {
    fontSize: '0.875rem',
    color: 'var(--text-muted)',
  },
  chartContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  legend: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    marginTop: '16px',
    justifyContent: 'center',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  legendDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
  },
  legendLabel: {
    fontSize: '0.875rem',
    color: 'var(--text-secondary)',
  },
  emptyChart: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '200px',
    color: 'var(--text-muted)',
    gap: '12px',
  },
  suggestionCard: {
    background: 'linear-gradient(135deg, var(--surface), var(--surface-light))',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '24px',
  },
  suggestionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '12px',
  },
  suggestionText: {
    color: 'var(--text-secondary)',
    marginBottom: '16px',
  },
  suggestionList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  suggestionItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    background: 'var(--surface)',
    borderRadius: 'var(--radius-md)',
  },
  suggestionRank: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: 'var(--text-muted)',
    width: '24px',
  },
  subjectDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
  },
  subjectName: {
    flex: 1,
    fontWeight: 500,
  },
  difficultyBadge: {
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'capitalize',
  },
}
