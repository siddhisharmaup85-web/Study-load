import React from 'react'
import { Info, Mail, Star, Sparkles, Download, Clock, BookOpen, User } from 'lucide-react'

export default function About() {
  const [hoveredCard, setHoveredCard] = React.useState(null)

  const contributors = [
    { name: 'Siddhi Sharma', role: 'Lead Developer', id: 1 },
    { name: 'Tanushka Raghav', role: 'UI/UX Designer', id: 2 },
    { name: 'Himanshu', role: 'Backend & AI', id: 3 }
  ]

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>About Study Load Balancer</h1>
          <p style={styles.subtitle}>AI-powered study planning and progress tracking</p>
        </div>
      </div>
      
      {/* App Info Card */}
      <div style={styles.infoCard}>
        <div style={styles.appLogo}>
          <Sparkles size={48} style={{ color: 'var(--primary)' }} />
        </div>
        <div style={styles.appDetails}>
          <h2 style={styles.sectionTitle}>What is Study Load Balancer?</h2>
          <p style={styles.description}>
            Study Load Balancer is an intelligent study management tool that helps you 
            organize subjects, track sessions, and maintain balanced study habits. Powered 
            by AI, it provides personalized study recommendations based on your subjects, 
            deadlines, and study patterns.
          </p>
        </div>
      </div>
      
      {/* Features Grid */}
      <div style={styles.featuresSection}>
        <h2 style={styles.sectionTitle}>Key Features</h2>
        <div style={styles.featuresGrid}>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>
              <Star size={24} />
            </div>
            <h3 style={styles.featureTitle}>Smart Balancing</h3>
            <p>AI analyzes your study patterns and suggests optimal study schedules</p>
          </div>
          
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>
              <Sparkles size={24} />
            </div>
            <h3 style={styles.featureTitle}>AI Insights</h3>
            <p>Real-time analytics and personalized study recommendations</p>
          </div>
          
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>
              <Clock size={24} />
            </div>
            <h3 style={styles.featureTitle}>Session Tracking</h3>
            <p>Detailed session logging with time grouping and progress visualization</p>
          </div>
          
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>
              <BookOpen size={24} />
            </div>
            <h3 style={styles.featureTitle}>Subject Management</h3>
            <p>Organize subjects with difficulty ratings and goal setting</p>
          </div>
        </div>
      </div>
      
      {/* Stats */}
      <div style={styles.statsSection}>
        <h2 style={styles.sectionTitle}>Your Progress</h2>
        <div style={styles.statsGrid}>
          <div style={styles.statItem}>
            <span style={styles.statNumber}>0</span>
            <span>Subjects</span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statNumber}>0</span>
            <span>Sessions</span>
          </div>
        </div>
      </div>
      
      {/* Created By Section */}
      <div style={styles.creatorsSection}>
        <h2 style={styles.sectionTitle}>Created By</h2>
        <div style={styles.creatorsGrid}>
          {contributors.map((contributor) => (
            <div 
              key={contributor.id}
              style={{
                ...styles.creatorCard,
                ... (hoveredCard === contributor.id ? styles.creatorCardHover : {}),
                transform: hoveredCard === contributor.id ? 'scale(1.20)' : 'scale(1)',
              }}
              onMouseEnter={() => setHoveredCard(contributor.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={styles.creatorIcon}>
                <User size={24} />
              </div>
              <h3 style={styles.creatorName}>{contributor.name}</h3>
              {hoveredCard === contributor.id ? (
                <div style={styles.roleDetails}>
                  <div style={styles.roleBadge}>{contributor.role}</div>
                </div>
              ) : (
                <div style={styles.roleBadgeHidden}>Hover to see role</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div style={styles.footerSection}>
        <h2 style={styles.sectionTitle}>Get Help</h2>
        <div style={styles.footerGrid}>
          <div style={styles.footerItem}>
            <Mail size={20} />
            <span>feedback@studybalancer.com</span>
          </div>
          <div style={styles.footerItem}>
            <Download size={20} />
            <span>Version 1.0.0</span>
          </div>
        </div>
      </div>
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
  infoCard: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '32px',
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    marginBottom: '32px',
  },
  appLogo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appDetails: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: 700,
    marginBottom: '20px',
    color: 'var(--text-primary)',
  },
  description: {
    fontSize: '1rem',
    lineHeight: '1.6',
    color: 'var(--text-secondary)',
    marginBottom: '16px',
  },
  featuresSection: {
    marginBottom: '32px',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
  },
  featureCard: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '24px',
    textAlign: 'center',
  },
  featureIcon: {
    width: '56px',
    height: '56px',
    borderRadius: 'var(--radius-lg)',
    background: 'var(--primary-dim)',
    color: 'var(--primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
  },
  featureTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    marginBottom: '8px',
    color: 'var(--text-primary)',
  },
  statsSection: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '32px',
    marginBottom: '32px',
  },
  statsGrid: {
    display: 'flex',
    gap: '48px',
    justifyContent: 'center',
  },
  statItem: {
    textAlign: 'center',
  },
  statNumber: {
    display: 'block',
    fontSize: '2.5rem',
    fontWeight: '700',
    color: 'var(--primary)',
    fontFamily: 'var(--font-heading)',
  },
  creatorsSection: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '32px',
    marginBottom: '32px',
  },
  creatorsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
  },
  creatorCard: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '24px',
    textAlign: 'center',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  },
  creatorCardHover: {
    boxShadow: '0 12px 32px rgba(0,0,0,0.2)',
    borderColor: 'var(--primary)',
  },
  creatorIcon: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
    transition: 'all 0.3s ease',
  },
  creatorName: {
    fontSize: '1.25rem',
    fontWeight: '700',
    marginBottom: '12px',
    color: 'var(--text-primary)',
    transition: 'all 0.3s ease',
  },
  roleDetails: {
    opacity: 1,
    transform: 'translateY(0)',
  },
  roleBadge: {
    background: 'var(--primary)',
    color: 'white',
    padding: '8px 20px',
    borderRadius: '25px',
    fontSize: '0.9rem',
    fontWeight: '600',
    marginTop: '8px',
    opacity: 1,
    transform: 'translateY(0)',
    transition: 'all 0.3s ease',
  },
  roleBadgeHidden: {
    opacity: 0,
    height: 0,
    marginTop: 0,
  },
  footerSection: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '32px',
  },
  footerGrid: {
    display: 'flex',
    gap: '24px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  footerItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    color: 'var(--text-secondary)',
    fontSize: '0.9375rem',
  },
}

