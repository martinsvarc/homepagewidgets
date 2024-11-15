'use client'
import * as React from "react"
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

type LeagueData = {
  id: number | string
  user_name: string
  overall_effectiveness: number
  created_at: string
  rank?: number
  profile_image: string
  badges: string[]
}

const mockLeagueData: LeagueData[] = [
  { 
    id: 1, 
    user_name: 'Agent45', 
    overall_effectiveness: 98, 
    created_at: '2024-02-20',
    profile_image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/agent45.jpg',
    badges: [
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/gold-league.png',
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/silver-league.png'
    ]
  },
  { 
    id: 2, 
    user_name: 'Agent23', 
    overall_effectiveness: 97, 
    created_at: '2024-02-20',
    profile_image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/agent23.jpg',
    badges: [
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/365-day-streak.png',
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/silver-league.png',
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bronze-league.png'
    ]
  },
  { 
    id: 3, 
    user_name: 'Agent35', 
    overall_effectiveness: 96, 
    created_at: '2024-02-20',
    profile_image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/agent35.jpg',
    badges: [
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/500-calls.png',
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/silver-league.png'
    ]
  }
]

const mockChartData = [
  { time: 'Mon', userPoints: 85, topUserPoints: 95 },
  { time: 'Tue', userPoints: 88, topUserPoints: 97 },
  { time: 'Wed', userPoints: 90, topUserPoints: 96 },
  { time: 'Thu', userPoints: 93, topUserPoints: 98 },
  { time: 'Fri', userPoints: 89, topUserPoints: 97 },
  { time: 'Sat', userPoints: 92, topUserPoints: 96 },
  { time: 'Sun', userPoints: 91, topUserPoints: 98 }
]

export default function League() {
  const [category, setCategory] = React.useState<'daily' | 'weekly' | 'monthly'>('daily')
  const [leagueData] = React.useState<LeagueData[]>(mockLeagueData)
  const [chartData] = React.useState(mockChartData)

  const getBorderColor = (rank: number, isCurrentUser: boolean) => {
    if (isCurrentUser) return 'border-[#50c2aa]'
    switch (rank) {
      case 1: return 'border-[#fbb351]'
      case 2: return 'border-[#546bc8]'
      case 3: return 'border-[#fb9851]'
      default: return 'border-gray-500'
    }
  }

  const currentUserProfile = {
    id: 'current-user',
    user_name: 'You',
    overall_effectiveness: 93,
    rank: 10,
    profile_image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=80&auto=format&fit=crop',
    badges: [
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bronze-league.png',
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/10-day-streak.png',
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/25-calls.png'
    ]
  }

  const renderUserProfile = (user: LeagueData & { rank: number }) => {
    const isCurrentUser = user.id === 'current-user'
    const rank = user.rank
    const borderColor = getBorderColor(rank, isCurrentUser)

    return (
      <div
        key={user.id}
        className={`
          flex items-center gap-2 p-2 rounded-[20px] shadow-sm
          bg-white border-2 ${borderColor}
        `}
      >
        <div className="flex-none w-6 text-sm font-medium text-gray-900">
          <span>#{rank}</span>
        </div>
        <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0">
          <img
            src={user.profile_image}
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
          {user.overall_effectiveness} pts
        </div>
      </div>
    )
  }

  return (
    <Card className="bg-white shadow-lg h-full">
      <CardContent className="p-3 h-full flex flex-col">
        <div className="flex flex-col gap-3 mb-4">
          <h2 className="text-[25px] font-bold text-[#556bc7] font-montserrat text-center">League</h2>
          <Tabs value={category} onValueChange={(value) => setCategory(value as 'daily' | 'weekly' | 'monthly')} className="w-full">
            <TabsList className="w-full grid grid-cols-3 bg-gray-50/50 p-1.5 rounded-full">
              <TabsTrigger 
                value="daily" 
                className="relative z-10 rounded-full px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-600 transition-all duration-300 hover:text-gray-900 data-[state=active]:bg-[#fbb350] data-[state=active]:text-white data-[state=active]:shadow-[0_4px_8px_-2px_rgba(251,179,80,0.3)]"
              >
                Weekly League
              </TabsTrigger>
              <TabsTrigger 
                value="weekly" 
                className="relative z-10 rounded-full px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-600 transition-all duration-300 hover:text-gray-900 data-[state=active]:bg-[#fbb350] data-[state=active]:text-white data-[state=active]:shadow-[0_4px_8px_-2px_rgba(251,179,80,0.3)]"
              >
                All Time
              </TabsTrigger>
              <TabsTrigger 
                value="monthly" 
                className="relative z-10 rounded-full px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-600 transition-all duration-300 hover:text-gray-900 data-[state=active]:bg-[#fbb350] data-[state=active]:text-white data-[state=active]:shadow-[0_4px_8px_-2px_rgba(251,179,80,0.3)]"
              >
                All Time Team
              </TabsTrigger>
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
                  <stop offset="5%" stopColor="#51c1a9" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#51c1a9" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#fbb350" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#fbb350" stopOpacity={0.1} />
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
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-[8px] border border-gray-200 bg-white p-2 shadow-lg">
                        <p className="text-sm font-medium" style={{ color: '#fbb350' }}>
                          Top Score: {payload[0].payload.topUserPoints} points
                        </p>
                        <p className="text-sm font-medium" style={{ color: '#51c1a9' }}>
                          Your Score: {payload[1].payload.userPoints} points
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Area
                type="monotone"
                dataKey="topUserPoints"
                stroke="#fbb350"
                strokeWidth={2}
                fillOpacity={0.3}
                fill="url(#goldGradient)"
                dot={false}
                stackId="1"
              />
              <Area
                type="monotone"
                dataKey="userPoints"
                stroke="#51c1a9"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorPoints)"
                dot={false}
                stackId="2"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 flex flex-col gap-3 min-h-0 overflow-hidden">
          {renderUserProfile(currentUserProfile)}
          <h3 className="text-lg font-semibold text-[#556bc7] font-montserrat pl-2">Top 3 places</h3>
          <div className="space-y-2 overflow-y-auto custom-scrollbar pr-1">
            {leagueData.sort((a, b) => b.overall_effectiveness - a.overall_effectiveness)
              .map((user, index) => renderUserProfile({ ...user, rank: index + 1 }))
              .slice(0, 3)}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
