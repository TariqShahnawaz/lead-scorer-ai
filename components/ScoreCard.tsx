interface ScoreCardProps {
  name: string
  company: string
  score: number
  grade: string
  reasons: string[]
  recommendation: string
}

export default function ScoreCard({ 
  name, company, score, grade, reasons, recommendation 
}: ScoreCardProps) {
  const color = 
    grade === 'A' ? '#22c55e' : 
    grade === 'B' ? '#3b82f6' : 
    grade === 'C' ? '#f59e0b' : '#ef4444'

  return (
    <div style={{
      border: `2px solid ${color}`,
      borderRadius: 12,
      padding: '1.5rem',
      maxWidth: 400,
      background: '#fff',
      color: '#171717',
      marginTop: '1rem'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 18, color: '#171717' }}>{name}</h2>
          <p style={{ margin: 0, color: '#4b5563', fontSize: 14 }}>{company}</p>
        </div>
        <div style={{
          width: 60, height: 60, borderRadius: '50%',
          background: color, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: 24, fontWeight: 'bold'
        }}>
          {grade}
        </div>
      </div>

      {/* Score bar */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 14, color: '#374151' }}>Lead Score</span>
          <span style={{ fontWeight: 'bold' }}>{score}/100</span>
        </div>
        <div style={{ background: '#e5e7eb', borderRadius: 999, height: 8 }}>
          <div style={{
            width: `${score}%`, height: '100%',
            background: color, borderRadius: 999,
            transition: 'width 1s ease'
          }} />
        </div>
      </div>

      {/* Reasons */}
      <div style={{ marginBottom: '1rem' }}>
        <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: '#171717' }}>
          Scoring Factors:
        </p>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          {reasons.map((reason, i) => (
            <li key={i} style={{ fontSize: 13, color: '#374151', marginBottom: 4 }}>
              {reason}
            </li>
          ))}
        </ul>
      </div>

      {/* Recommendation */}
      <div style={{
        background: `${color}20`,
        borderRadius: 8, padding: '0.75rem',
        fontSize: 13, color: '#1f2937'
      }}>
        💡 {recommendation}
      </div>
    </div>
  )
}