export interface LeadInput {
  name: string
  company: string
  budget: number
  industry: string
  employees: number
  interest: string
}

export interface LeadScore {
  name: string
  company: string
  score: number
  grade: string
  reasons: string[]
  recommendation: string
}

export function ToolInputStreaming({ input }: { input?: Partial<LeadInput> }) {
  return (
    <div style={{
      padding: '1rem',
      border: '1px solid #93c5fd',
      borderRadius: 8,
      background: '#eff6ff',
      color: '#1e3a8a',
      marginTop: '1rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 16, height: 16,
          border: '2px solid #3b82f6',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <span style={{ fontWeight: 600 }}>Preparing lead assessment...</span>
      </div>
      <p style={{ margin: '0.5rem 0 0 24px', fontSize: 13, color: '#475569' }}>
        Generating scoring parameters{input?.company ? ` for ${input.company}` : ''}
      </p>
      {input && Object.keys(input).length > 0 && (
        <div style={{ margin: '0.5rem 0 0 24px', fontSize: 12, color: '#475569' }}>
          {input.name && <p style={{ margin: '2px 0' }}>Lead: {input.name}</p>}
          {input.budget !== undefined && <p style={{ margin: '2px 0' }}>Budget: ${input.budget.toLocaleString()}</p>}
          {input.industry && <p style={{ margin: '2px 0' }}>Industry: {input.industry}</p>}
        </div>
      )}
    </div>
  )
}

export function ToolInputAvailable({ input }: { input: LeadInput }) {
  return (
    <div style={{
      padding: '1rem',
      border: '1px solid #3b82f6',
      borderRadius: 8,
      background: '#eff6ff',
      marginTop: '1rem'
    }}>
      <p style={{ margin: '0 0 8px', fontWeight: 600, color: '#1d4ed8', fontSize: 14 }}>
        Lead details received — ready to score
      </p>
      <div style={{ fontSize: 12, color: '#475569' }}>
        <p style={{ margin: '2px 0' }}>Name: {input.name}</p>
        <p style={{ margin: '2px 0' }}>Company: {input.company}</p>
        <p style={{ margin: '2px 0' }}>Budget: ${input.budget.toLocaleString()}</p>
        <p style={{ margin: '2px 0' }}>Industry: {input.industry}</p>
        <p style={{ margin: '2px 0' }}>Employees: {input.employees}</p>
        <p style={{ margin: '2px 0' }}>Interest: {input.interest}</p>
      </div>
    </div>
  )
}

export function ToolOutputError({ retry, message }: { retry: () => void; message?: string }) {
  return (
    <div style={{
      padding: '1rem',
      border: '1px solid #ef4444',
      borderRadius: 8,
      background: '#fef2f2',
      marginTop: '1rem'
    }}>
      <p style={{ margin: '0 0 8px', fontWeight: 600, color: '#dc2626', fontSize: 14 }}>
        ❌ Scoring failed
      </p>
      <p style={{ margin: '0 0 12px', fontSize: 13, color: '#666' }}>
        {message || "We couldn't calculate this lead's score. Please try again."}
      </p>
      <button
        type="button"
        onClick={retry}
        style={{
          background: '#dc2626',
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          padding: '6px 16px',
          cursor: 'pointer',
          fontSize: 13
        }}
      >
        Retry
      </button>
    </div>
  )
}