export interface SlideTemplate {
  id: string
  title: string
  description: string
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
    tags: ['numbers']
  },
  {
    id: 'meeting-sources',
    title: 'How You Met',
    description: 'Breakdown of how you met your dates - apps, mutual friends, events, etc.',
    tags: ['people']
  },
  {
    id: 'success-rate',
    title: 'Your Success Rate',
    description: 'How many first dates led to second dates and beyond',
    tags: ['outcomes']
  },
  {
    id: 'occupation-insights',
    title: 'Professional Patterns',
    description: 'Most common occupations among your dates',
    tags: ['people']
  },
  {
    id: 'age-range',
    title: 'Age Demographics',
    description: 'Age distribution of your dating pool',
    tags: ['numbers', 'people']
  },
  {
    id: 'meeting-places',
    title: 'Where the Magic Happens',
    description: 'Top locations and venues for your dates',
    tags: ['people']
  },
  {
    id: 'ghosting-stats',
    title: 'The Ghost Report',
    description: 'Analyzing the ghosting patterns in your dating life',
    tags: ['outcomes']
  },
  {
    id: 'date-costs',
    title: 'Dating Economics',
    description: 'Your dating expenses and most lavish dates',
    tags: ['money']
  },
  {
    id: 'red-flags',
    title: 'Red Flag Collection',
    description: 'Most common red flags you encountered',
    tags: ['outcomes']
  },
  {
    id: 'green-flags',
    title: 'Green Flag Gallery',
    description: 'Positive patterns and traits you appreciated',
    tags: ['outcomes']
  },
  {
    id: 'date-duration',
    title: 'Time Well Spent?',
    description: 'Average date duration and your longest dates',
    tags: ['time']
  },
  {
    id: 'relationship-outcomes',
    title: 'Where Are They Now?',
    description: 'The various outcomes of your dating adventures',
    tags: ['outcomes']
  },
  {
    id: 'best-dates',
    title: 'Greatest Hits',
    description: 'Your highest-rated dates and what made them special',
    tags: ['outcomes']
  },
  {
    id: 'hotness-analysis',
    title: 'Attraction Insights',
    description: 'Analyzing your attraction patterns and preferences',
    tags: ['numbers', 'people']
  },
  {
    id: 'dating-seasons',
    title: 'Dating Seasons',
    description: 'Your most active dating months and seasonal patterns',
    tags: ['time']
  },
  {
    id: 'platform-success',
    title: 'Platform Performance',
    description: 'Which dating platforms led to your most successful matches',
    tags: ['numbers', 'outcomes']
  },
  {
    id: 'relationship-status-insights',
    title: 'Status Stories',
    description: 'How relationship status affected your dating outcomes',
    tags: ['people', 'outcomes']
  },
  {
    id: 'rating-patterns',
    title: 'Rating Revelations',
    description: 'Analyzing the correlation between ratings and outcomes',
    tags: ['numbers', 'outcomes']
  },
  {
    id: 'cost-analysis',
    title: 'Cost vs. Success',
    description: 'How spending patterns related to date success',
    tags: ['money', 'numbers']
  },
  {
    id: 'duration-insights',
    title: 'Time Investment',
    description: 'How date duration influenced your connections',
    tags: ['time', 'numbers']
  }
] 