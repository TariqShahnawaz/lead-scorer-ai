'use client'

import { useChat } from '@ai-sdk/react'
import type { UIMessage } from 'ai'
import { Suspense, useState } from 'react'
import ScoreCard from '@/components/ScoreCard'
import { ToolInputStreaming, ToolInputAvailable, ToolOutputError, type LeadInput, type LeadScore } from '@/components/ToolStates'

type LeadChatMessage = UIMessage<unknown, never, {
  scoreLead: {
    input: LeadInput
    output: LeadScore
  }
}>

export default function Home() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading lead scorer...</div>}>
      <LeadScorer />
    </Suspense>
  )
}

function LeadScorer() {
  const [form, setForm] = useState({
    name: '', company: '', budget: '',
    industry: '', employees: '', interest: ''
  })

  const { messages, sendMessage, status, error, regenerate } = useChat<LeadChatMessage>()
  const isLoading = status === 'streaming' || status === 'submitted'

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.company) return

    sendMessage({
      text: `Please score this lead:
        Name: ${form.name}
        Company: ${form.company}
        Budget (USD): ${form.budget}
        Industry: ${form.industry}
        Employees: ${form.employees}
        Interest: ${form.interest}
      `
    })
  }

  return (
    <main style={{ maxWidth: 600, margin: '0 auto', padding: '2rem', color: '#171717' }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
        Lead Scorer AI
      </h1>
      <p style={{ color: '#4b5563', marginBottom: '2rem' }}>
        Enter lead details to get an AI-powered score
      </p>

      {/* Lead Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        {[
          { key: 'name', label: 'Full Name', type: 'text', placeholder: 'John Smith' },
          { key: 'company', label: 'Company', type: 'text', placeholder: 'Acme Corp' },
          { key: 'budget', label: 'Budget (USD)', type: 'number', placeholder: '10000' },
          { key: 'industry', label: 'Industry', type: 'text', placeholder: 'Technology' },
          { key: 'employees', label: 'Number of Employees', type: 'number', placeholder: '50' },
        ].map(field => (
          <div key={field.key} style={{ marginBottom: '1rem' }}>
            <label
              htmlFor={field.key}
              style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 4 }}
            >
              {field.label}
            </label>
            <input
              id={field.key}
              type={field.type}
              placeholder={field.placeholder}
              value={form[field.key as keyof typeof form]}
              onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
              style={{
                width: '100%', padding: '8px 12px',
                border: '1px solid #d1d5db', borderRadius: 6,
                fontSize: 14, boxSizing: 'border-box' as const,
                color: '#171717', background: '#fff'
              }}
            />
          </div>
        ))}

        <div style={{ marginBottom: '1rem' }}>
          <label
            htmlFor="interest"
            style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 4 }}
          >
            What are they interested in?
          </label>
          <textarea
            id="interest"
            placeholder="Describe what the lead is looking for..."
            value={form.interest}
            onChange={e => setForm(f => ({ ...f, interest: e.target.value }))}
            rows={3}
            style={{
              width: '100%', padding: '8px 12px',
              border: '1px solid #d1d5db', borderRadius: 6,
              fontSize: 14, boxSizing: 'border-box' as const,
              color: '#171717', background: '#fff'
            }}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !form.name || !form.company}
          style={{
            width: '100%', padding: '10px',
            background: isLoading ? '#94a3b8' : '#3b82f6',
            color: '#fff', border: 'none', borderRadius: 6,
            fontSize: 15, fontWeight: 600,
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? 'Scoring...' : 'Score This Lead'}
        </button>
      </form>

      {/* Error state */}
      {error && <ToolOutputError retry={() => regenerate()} message={error.message} />}

      {/* Empty state */}
      {messages.length === 0 && !isLoading && (
        <div style={{
          textAlign: 'center', padding: '3rem',
          border: '2px dashed #e5e7eb',
          borderRadius: 12, color: '#9ca3af'
        }}>
          <p style={{ fontSize: 32, margin: '0 0 8px' }}>📊</p>
          <p style={{ fontWeight: 600, margin: '0 0 4px' }}>No leads scored yet</p>
          <p style={{ fontSize: 14, margin: 0 }}>
            Fill in the form above to score your first lead
          </p>
        </div>
      )}

      {/* Messages and tool states */}
      {messages.map(message => (
        <div key={message.id}>
          {message.parts.map((part, i) => {
            if (part.type === 'tool-scoreLead') {
              switch (part.state) {
                case 'input-streaming':
                  return <ToolInputStreaming key={part.toolCallId} input={part.input} />
                case 'input-available':
                  return <ToolInputAvailable key={part.toolCallId} input={part.input} />
                case 'output-available':
                  return (
                    <ScoreCard
                      key={part.toolCallId}
                      name={part.output.name}
                      company={part.output.company}
                      score={part.output.score}
                      grade={part.output.grade}
                      reasons={part.output.reasons}
                      recommendation={part.output.recommendation}
                    />
                  )
                case 'output-error':
                  return (
                    <ToolOutputError
                      key={part.toolCallId}
                      message={part.errorText}
                      retry={() => regenerate({ messageId: message.id })}
                    />
                  )
                default:
                  return null
              }
            }

            if (part.type === 'text') {
              return (
                <p key={i} style={{ color: '#374151', fontSize: 14 }}>
                  {part.text}
                </p>
              )
            }
            return null
          })}
        </div>
      ))}
    </main>
  )
}