'use client'
import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useSearchParams } from 'next/navigation'

export default function CalendarStreak() {
  const [currentMonth, setCurrentMonth] = React.useState(new Date())
  const [streakData, setStreakData] = React.useState({
    current: 0,
    longest: 0,
    activeDates: [] as string[]
  })

  const searchParams = useSearchParams()
  const memberId = searchParams.get('memberId')

  // Fetch streak data from the API
  React.useEffect(() => {
    if (memberId) {
      fetch(`/api/track-activity?memberId=${memberId}`)
        .then(response => response.json())
        .then(data => {
          setStreakData({
            current: data.currentStreak || 0,
            longest: data.longestStreak || 0,
            activeDates: data.activeDates || []
          })
        })
        .catch(error => console.error('Error loading streak data:', error))
    }
  }, [memberId, currentMonth])

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate()

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay()

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const getDateStatus = (date: number) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`
    if (streakData.activeDates.includes(dateStr)) {
      return 'currentStreak'
    }
    return 'inactive'
  }

  const calculateConsistency = () => {
    const today = new Date()
    const currentDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), today.getDate())
    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
    
    // Only count days up to today
    const daysToDate = Math.min(
      today.getDate(),
      Math.floor((currentDate.getTime() - startOfMonth.getTime()) / (1000 * 60 * 60 * 24)) + 1
    )

    const activeDaysThisMonth = streakData.activeDates.filter(date => {
      const activeDate = new Date(date)
      return activeDate.getMonth() === currentMonth.getMonth() &&
             activeDate.getFullYear() === currentMonth.getFullYear() &&
             activeDate <= today
    }).length

    return Math.round((activeDaysThisMonth / daysToDate) * 100)
  }

  const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
  const weeks = []
  let week = []
  
  for (let i = 0; i < firstDayOfMonth; i++) {
    week.push(null)
  }
  
  for (let day = 1; day <= daysInMonth; day++) {
    week.push(day)
    if (week.length === 7) {
      weeks.push(week)
      week = []
    }
  }
  
  if (week.length > 0) {
    while (week.length < 7) {
      week.push(null)
    }
    weeks.push(week)
  }

  const isToday = (date: number | null) => {
    if (!date) return false
    const today = new Date()
    return (
      date === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    )
  }

  return (
    <Card className="bg-white shadow-lg h-full">
      <CardContent className="flex flex-col h-full p-3">
        <h2 className="text-[25px] font-bold text-[#556bc7] font-montserrat text-center mb-3">
          Calendar & Streak
        </h2>
        <div className="flex justify-between gap-2 mb-3">
          <Button className="h-14 flex-1 bg-[#556bc7] hover:bg-[#4a5eb3] text-white rounded-[20px] shadow-md transition-all duration-300">
            <div className="w-full flex flex-col items-center">
              <p className="text-xs font-medium text-white/80">Current</p>
              <p className="text-lg font-extrabold mt-auto mb-auto text-white">
                {streakData.current}
              </p>
            </div>
          </Button>
          <Button className="h-14 flex-1 bg-[#51c1a9] hover:bg-[#48ad97] text-white rounded-[20px] shadow-md transition-all duration-300">
            <div className="w-full flex flex-col items-center">
              <p className="text-xs font-medium text-white/80">
                Consistency
              </p>
              <p className="text-lg font-extrabold mt-auto mb-auto text-white">
                {calculateConsistency()}%
              </p>
            </div>
          </Button>
          <Button className="h-14 flex-1 bg-[#fbb350] hover:bg-[#faa638] text-white rounded-[20px] shadow-md transition-all duration-300">
            <div className="w-full flex flex-col items-center">
              <p className="text-xs font-medium text-white/80">Longest</p>
              <p className="text-lg font-extrabold mt-auto mb-auto text-white">
                {streakData.longest}
              </p>
            </div>
          </Button>
        </div>
        <div className="flex items-center justify-between mb-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-gray-400 hover:text-gray-600 hover:bg-gray-50"
            onClick={prevMonth}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm font-bold text-gray-900">
            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-gray-400 hover:text-gray-600 hover:bg-gray-50"
            onClick={nextMonth}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center mb-1">
          {days.map((day) => (
            <div key={day} className="text-[10px] font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 flex-1">
          {weeks.map((week, weekIndex) => (
            <React.Fragment key={weekIndex}>
              {week.map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  className={cn(
                    "aspect-square flex items-center justify-center relative text-xs",
                    {
                      "text-gray-400": day && getDateStatus(day) === 'inactive',
                      "border border-[#556bc7] text-[#556bc7] font-extrabold rounded-[8px]": day && isToday(day),
                      "bg-[#51c1a9] border border-[#51c1a9] text-white font-extrabold rounded-[8px] shadow-sm": day && getDateStatus(day) === 'currentStreak',
                      "": !day,
                    }
                  )}
                >
                  {day && (
                    <span>
                      {day}
                    </span>
                  )}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
