'use client'
import { ErrorBoundary } from 'react-error-boundary'
import ActivityCircles from '@/components/ActivityCircles'
import AchievementShowcase from '@/components/AchievementShowcase'
import AreasOfImprovement from '@/components/AreasOfImprovement'
import CalendarStreak from '@/components/CalendarStreak'
import DailyPersonalizedImprovementPlan from '@/components/DailyPersonalizedImprovementPlan'
import League from '@/components/League'

// Move ErrorFallback to a separate component
const ErrorFallback = ({ error }: { error: Error }) => {
  return (
    <div className="p-4 bg-red-50 text-red-600 rounded-lg">
      <h2 className="text-lg font-semibold">Something went wrong:</h2>
      <pre className="mt-2 text-sm">{error.message}</pre>
    </div>
  )
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-2 sm:p-4 lg:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 lg:gap-6">
          <div className="md:col-span-1">
            <ErrorBoundary fallback={<ErrorFallback error={new Error('Calendar error')} />}>
              <CalendarStreak />
            </ErrorBoundary>
          </div>
          
          <div className="md:col-span-1">
            <ErrorBoundary fallback={<ErrorFallback error={new Error('League error')} />}>
              <League />
            </ErrorBoundary>
          </div>
          
          <div className="space-y-2 sm:space-y-4 lg:space-y-6">
            <ErrorBoundary fallback={<ErrorFallback error={new Error('Improvement plan error')} />}>
              <DailyPersonalizedImprovementPlan />
            </ErrorBoundary>
            <ErrorBoundary fallback={<ErrorFallback error={new Error('Areas improvement error')} />}>
              <AreasOfImprovement />
            </ErrorBoundary>
          </div>
          
          <div className="md:col-span-2">
            <ErrorBoundary fallback={<ErrorFallback error={new Error('Achievement error')} />}>
              <AchievementShowcase />
            </ErrorBoundary>
          </div>
          <div className="md:col-span-1">
            <ErrorBoundary fallback={<ErrorFallback error={new Error('Activity error')} />}>
              <ActivityCircles />
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </div>
  )
}
