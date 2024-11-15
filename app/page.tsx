'use client'
import { ErrorBoundary } from 'react-error-boundary'
import { Suspense } from 'react'
import ActivityCircles from '@/components/ActivityCircles'
import AchievementShowcase from '@/components/AchievementShowcase'
import AreasOfImprovement from '@/components/AreasOfImprovement'
import CalendarStreak from '@/components/CalendarStreak'
import DailyPersonalizedImprovementPlan from '@/components/DailyPersonalizedImprovementPlan'
import League from '@/components/League'

const ErrorFallback = ({ error }: { error: Error }) => {
  return (
    <div className="p-4 bg-red-50 text-red-600 rounded-lg">
      <h2 className="text-lg font-semibold">Something went wrong:</h2>
      <pre className="mt-2 text-sm">{error.message}</pre>
    </div>
  )
}

const LoadingFallback = () => (
  <div className="animate-pulse">
    <div className="h-full w-full bg-gray-200 rounded-lg min-h-[200px]"></div>
  </div>
)

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-2 sm:p-4 lg:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 lg:gap-6">
          <div className="md:col-span-1">
            <ErrorBoundary fallback={<ErrorFallback error={new Error('Calendar error')} />}>
              <Suspense fallback={<LoadingFallback />}>
                <CalendarStreak />
              </Suspense>
            </ErrorBoundary>
          </div>
          
          <div className="md:col-span-1">
            <ErrorBoundary fallback={<ErrorFallback error={new Error('League error')} />}>
              <Suspense fallback={<LoadingFallback />}>
                <League />
              </Suspense>
            </ErrorBoundary>
          </div>
          
          <div className="space-y-2 sm:space-y-4 lg:space-y-6">
            <ErrorBoundary fallback={<ErrorFallback error={new Error('Improvement plan error')} />}>
              <Suspense fallback={<LoadingFallback />}>
                <DailyPersonalizedImprovementPlan />
              </Suspense>
            </ErrorBoundary>
            <ErrorBoundary fallback={<ErrorFallback error={new Error('Areas improvement error')} />}>
              <Suspense fallback={<LoadingFallback />}>
                <AreasOfImprovement />
              </Suspense>
            </ErrorBoundary>
          </div>
          
          <div className="md:col-span-2">
            <ErrorBoundary fallback={<ErrorFallback error={new Error('Achievement error')} />}>
              <Suspense fallback={<LoadingFallback />}>
                <AchievementShowcase />
              </Suspense>
            </ErrorBoundary>
          </div>
          <div className="md:col-span-1">
            <ErrorBoundary fallback={<ErrorFallback error={new Error('Activity error')} />}>
              <Suspense fallback={<LoadingFallback />}>
                <ActivityCircles />
              </Suspense>
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </div>
  )
}
