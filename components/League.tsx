'use client'
import * as React from "react"
import Image from "next/image" // Add this import
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { useSearchParams } from 'next/navigation'

type LeagueData = {
  user_id: string
  user_name: string
  profile_picture_url: string
  badges: string[]
  total_points: number
  rank: number
  days_active: number
}

type ChartData = {
  time: string
  user_points: number
  top_user_points: number
}

type TooltipPayload = {
  value: number
  dataKey: string
  payload: {
    time: string
    user_points: number
    top_user_points: number
  }
}

export default function League() {
  const [category, setCategory] = React.useState<'weekly' | 'allTime' | 'team'>('weekly')
  const [leagueData, setLeagueData] = React.useState<LeagueData[]>([])
  const [chartData, setChartData] = React.useState<ChartData[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  const searchParams = useSearchParams()
  const memberId = searchParams.get('memberId')

  const fetchData = React.useCallback(async () => {
    if (!memberId) return

    try {
      setIsLoading(true)
      const response = await fetch(`/api/league-rankings?memberId=${memberId}&period=${category}`)
      const data = await response.json()
      
      if (response.ok) {
        setLeagueData(data.rankings || [])
        setChartData(data.chartData || [])
      } else {
        console.error('Error fetching league data:', data.error)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [memberId, category])

  React.useEffect(() => {
    fetchData()
  }, [fetchData])

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
          <Image
            src={user.profile_picture_url}
            alt={user.user_name}
            width={32}
            height={32}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-sm font-medium text-gray-900 truncate">
            <span className="truncate">{user.user_name}</span>
            <div className="flex-shrink-0 flex items-center">
              {user.badges?.map((badge, index) => (
                <Image
                  key={index}
                  src={badge}
                  alt={`Badge ${index + 1}`}
                  width={16}
                  height={16}
                  className="w-4 h-4 object-contain"
                />
              ))}
            </div>
          </div>
          <div className="text-xs text-gray-500">
            {user.days_active} days active
          </div>
        </div>
        <div className="text-sm font-medium text-gray-900 flex-shrink-0">
          {user.total_points.toLocaleString()} pts
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <Card className="bg-white shadow-lg h-full">
        <CardContent className="p-3">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"/>
            <div className="h-10 bg-gray-200 rounded"/>
            <div className="h-[220px] bg-gray-200 rounded"/>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"/>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white shadow-lg h-full">
      <CardContent className="p-3 h-full flex flex-col">
        <div className="flex flex-col gap-3 mb-4">
          <h2 className="text-[25px] font-bold text-[#556bc7] font-montserrat text-center">League</h2>
          <Tabs value={category} onValueChange={(value) => setCategory(value as 'weekly' | 'allTime' | 'team')} className="w-full">
            <TabsList className="w-full grid grid-cols-3 bg-gray-50/50 p-1.5 rounded-full">
              <TabsTrigger value="weekly">Weekly League</TabsTrigger>
              <TabsTrigger value="allTime">All Time</TabsTrigger>
              <TabsTrigger value="team">Team League</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="h-[220px] w-full bg-gray-100 rounded-[20px] p-2 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorPoints" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#51c1a9" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#51c1a9" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#fbb350" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#fbb350" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#333', fontSize: 12 }}
                dy={2}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#333', fontSize: 12 }}
                dx={-5}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length >= 2) {
                    const userPoints = (payload[0] as TooltipPayload).value
                    const topPoints = (payload[1] as TooltipPayload).value
                    
                    return (
                      <div className="rounded-[8px] border border-gray-200 bg-white p-2 shadow-lg">
                        <p className="text-sm font-medium" style={{ color: '#fbb350' }}>
                          Top Score: {topPoints.toLocaleString()} points
                        </p>
                        <p className="text-sm font-medium" style={{ color: '#51c1a9' }}>
                          Your Score: {userPoints.toLocaleString()} points
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Area
                type="monotone"
                dataKey="user_points"
                stroke="#51c1a9"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorPoints)"
                dot={false}
              />
              <Area
                type="monotone"
                dataKey="top_user_points"
                stroke="#fbb350"
                strokeWidth={2}
                fillOpacity={0.3}
                fill="url(#goldGradient)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 flex flex-col gap-3 min-h-0 overflow-hidden">
          <div className="space-y-2 overflow-y-auto custom-scrollbar pr-1">
            {leagueData.map((user) => renderUserProfile(user))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
