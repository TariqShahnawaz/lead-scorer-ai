import { tool } from 'ai'
import { z } from 'zod'

export const scoreLead = tool({
  description: 'Score a sales lead based on their information and return a score with reasoning',
  inputSchema: z.object({
    name: z.string().describe('Full name of the lead'),
    company: z.string().describe('Company name'),
    budget: z.number().describe('Budget in USD'),
    industry: z.string().describe('Industry the lead works in'),
    employees: z.number().describe('Number of employees in the company'),
    interest: z.string().describe('What they are interested in'),
  }),
  execute: async ({ name, company, budget, industry, employees, interest }: {
    name: string
    company: string
    budget: number
    industry: string
    employees: number
    interest: string
  }) => {
    let score = 0
    let reasons: string[] = []

    if (budget >= 10000) { score += 30; reasons.push('High budget') }
    else if (budget >= 5000) { score += 20; reasons.push('Medium budget') }
    else { score += 10; reasons.push('Low budget') }

    if (employees >= 100) { score += 25; reasons.push('Large company') }
    else if (employees >= 20) { score += 15; reasons.push('Mid-size company') }
    else { score += 5; reasons.push('Small company') }

    const highValueIndustries = ['tech', 'finance', 'healthcare', 'software']
    if (highValueIndustries.some(i => industry.toLowerCase().includes(i))) {
      score += 25
      reasons.push('High-value industry')
    } else {
      score += 10
      reasons.push('Standard industry')
    }

    if (interest.length > 50) { score += 20; reasons.push('Detailed interest shown') }
    else { score += 10; reasons.push('Basic interest') }

    return {
      name,
      company,
      score: Math.min(score, 100),
      grade: score >= 80 ? 'A' : score >= 60 ? 'B' : score >= 40 ? 'C' : 'D',
      reasons,
      recommendation: score >= 60
        ? 'High priority — contact within 24 hours'
        : 'Low priority — add to nurture campaign',
    }
  },
})