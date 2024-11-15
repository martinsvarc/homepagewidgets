'use client'
import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useSearchParams } from 'next/navigation'

type LeagueData = {
  user_id: string
  user_name: string
  profile_picture_url: string
  badges: string[]
  total_points: number
  rank: number
}

export default function League() {
  const [category, setCategory] = React.useState<'daily' | 'weekly' | 'monthly'>('daily')
  const [leagueData, setLeagueData] = React.useState<LeagueData[]>([])
  const [chartData, setChartData] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  const searchParams = useSearchParams()
  const memberId = searchParams.get('memberId')

  // Fetch league data
  React.useEffect(() => {
    if (memberId) {
      setIsLoading(true)
      fetch(`/api/league-rankings?memberId=${memberId}&period=${category}`)
        .then(response => response.json())
        .then(data => {
          setLeagueData(data)
          setIsLoading(false)
        })
        .catch(error => {
          console.error('Error loading league data:', error)
          setIsLoading(false)
        })
    }
  }, [memberId, category])

  const getBorderColor = (rank: number, isCurrentUser: boolean) => {
    if (isCurrentUser) return 'border-[#50c2aa]'
    switch (rank) {
      case 1: return 'border-[#fbb351]'
      case 2: return 'border-[#546bc8]'
      case 3: return 'border-[#fb9851]'
      default: return 'border-gray-500'
    }
  }

  const renderUserProfile = (user: LeagueData) => {
    const isCurrentUser = user.user_id === memberId
    const borderColor = getBorderColor(user.rank, isCurrentUser)

    return (
      <div
        key={user.user_id}
        className={`
          flex items-center gap-2 p-2 rounded-[20px] shadow-sm
          bg-white border-2 ${borderColor}
        `}
      >
        <div className="flex-none w-6 text-sm font-medium text-gray-900">
          <span>#{user.rank}</span>
        </div>
        <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0">
          <img
            src={user.profile_picture_url}
            alt={user.user_name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-sm font-medium text-gray-900 truncate">
            <span className="truncate">{user.user_name}</span>
            <div className="flex-shrink-0 flex items-center">
              {user.badges?.map((badge, index) => (
                <img
                  key={index}
                  src={badge}
                  alt={`Badge ${index + 1}`}
                  className="w-4 h-4 object-contain"
                />
              ))}
            </div>
          </div>
        </div>
        <div className="text-sm font-medium text-gray-900 flex-shrink-0">
          {user.total_points} pts
        </div>
      </div>
    )
  }

  if (isLoading) {
    return <div className="animate-pulse">Loading...</div>
  }

  return (
    <Card className="bg-white shadow-lg h-full">
      <CardContent className="p-3 h-full flex flex-col">
        <div className="flex flex-col gap-3 mb-4">
          <h2 className="text-[25px] font-bold text-[#556bc7] font-montserrat text-center">League</h2>
          <Tabs value={category} onValueChange={(value) => setCategory(value as 'daily' | 'weekly' | 'monthly')} className="w-full">
            <TabsList className="w-full grid grid-cols-3 bg-gray-50/50 p-1.5 rounded-full">
              <TabsTrigger value="weekly">Weekly League</TabsTrigger>
              <TabsTrigger value="allTime">All Time</TabsTrigger>
              <TabsTrigger value="team">Team League</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex-1 flex flex-col gap-3 min-h-0 overflow-hidden">
          <h3 className="text-lg font-semibold text-[#556bc7] font-montserrat pl-2">Rankings</h3>
          <div className="space-y-2 overflow-y-auto custom-scrollbar pr-1">
            {leagueData.map((user) => renderUserProfile(user))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
