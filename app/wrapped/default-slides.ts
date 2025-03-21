export interface SlideTemplate {
  id: string
  title: string
  description: string
  type: 'stat' | 'insight' | 'fun_fact'
  tags?: string[]
}

// Define main tag categories
export const TAG_COLORS = {
  numbers: 'bg-blue-100 text-blue-800',
  money: 'bg-emerald-100 text-emerald-800',
  people: 'bg-violet-100 text-violet-800',
  time: 'bg-amber-100 text-amber-800',
  outcomes: 'bg-rose-100 text-rose-800',
  custom: 'bg-gray-100 text-gray-800'
} as const

export type TagColor = keyof typeof TAG_COLORS

export const defaultSlides: SlideTemplate[] = [
  {
    id: 'total-dates',
    title: 'Your Dating Year in Numbers',
    description: 'Total number of dates and unique people you met this year',
    type: 'stat',
    tags: ['numbers']
  },
  {
    id: 'meeting-sources',
    title: 'How You Met',
    description: 'Breakdown of how you met your dates - apps, mutual friends, events, etc.',
    type: 'stat',
    tags: ['people']
  },
  {
    id: 'success-rate',
    title: 'Your Success Rate',
    description: 'How many first dates led to second dates and beyond',
    type: 'stat',
    tags: ['outcomes']
  },
  {
    id: 'occupation-insights',
    title: 'Professional Patterns',
    description: 'Most common occupations among your dates',
    type: 'insight',
    tags: ['people']
  },
  {
    id: 'age-range',
    title: 'Age Demographics',
    description: 'Age distribution of your dating pool',
    type: 'stat',
    tags: ['numbers', 'people']
  },
  {
    id: 'meeting-places',
    title: 'Where the Magic Happens',
    description: 'Top locations and venues for your dates',
    type: 'insight',
    tags: ['people']
  },
  {
    id: 'ghosting-stats',
    title: 'The Ghost Report',
    description: 'Analyzing the ghosting patterns in your dating life',
    type: 'fun_fact',
    tags: ['outcomes']
  },
  {
    id: 'date-costs',
    title: 'Dating Economics',
    description: 'Your dating expenses and most lavish dates',
    type: 'stat',
    tags: ['money']
  },
  {
    id: 'red-flags',
    title: 'Red Flag Collection',
    description: 'Most common red flags you encountered',
    type: 'fun_fact',
    tags: ['outcomes']
  },
  {
    id: 'green-flags',
    title: 'Green Flag Gallery',
    description: 'Positive patterns and traits you appreciated',
    type: 'insight',
    tags: ['outcomes']
  },
  {
    id: 'date-duration',
    title: 'Time Well Spent?',
    description: 'Average date duration and your longest dates',
    type: 'stat',
    tags: ['time']
  },
  {
    id: 'relationship-outcomes',
    title: 'Where Are They Now?',
    description: 'The various outcomes of your dating adventures',
    type: 'insight',
    tags: ['outcomes']
  },
  {
    id: 'best-dates',
    title: 'Greatest Hits',
    description: 'Your highest-rated dates and what made them special',
    type: 'insight',
    tags: ['outcomes']
  },
  {
    id: 'hotness-analysis',
    title: 'Attraction Insights',
    description: 'Analyzing your attraction patterns and preferences',
    type: 'fun_fact',
    tags: ['numbers', 'people']
  },
  {
    id: 'dating-seasons',
    title: 'Dating Seasons',
    description: 'Your most active dating months and seasonal patterns',
    type: 'insight',
    tags: ['time']
  },
  {
    id: 'platform-success',
    title: 'Platform Performance',
    description: 'Which dating platforms led to your most successful matches',
    type: 'stat',
    tags: ['numbers', 'outcomes']
  },
  {
    id: 'relationship-status-insights',
    title: 'Status Stories',
    description: 'How relationship status affected your dating outcomes',
    type: 'insight',
    tags: ['people', 'outcomes']
  },
  {
    id: 'rating-patterns',
    title: 'Rating Revelations',
    description: 'Analyzing the correlation between ratings and outcomes',
    type: 'insight',
    tags: ['numbers', 'outcomes']
  },
  {
    id: 'cost-analysis',
    title: 'Cost vs. Success',
    description: 'How spending patterns related to date success',
    type: 'stat',
    tags: ['money', 'numbers']
  },
  {
    id: 'duration-insights',
    title: 'Time Investment',
    description: 'How date duration influenced your connections',
    type: 'insight',
    tags: ['time', 'numbers']
  }
] 