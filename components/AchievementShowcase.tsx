'use client'
import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { useSearchParams } from 'next/navigation'

interface Badge {
  id: string
  name: string
  description: string
  imageUrl: string
  earned: boolean
  earnedDate?: string
  progress: number
  requiredAmount: number
  category: 'streak' | 'calls' | 'activity' | 'league'
}

interface BadgeProps {
  badge: Badge
}

const BadgeCard: React.FC<BadgeProps> = ({ badge }) => {
  const progressPercentage = Math.min((badge.progress / badge.requiredAmount) * 100, 100)
  
  return (
    <div className={`
      relative p-4 rounded-[20px] border-2 
      ${badge.earned ? 'border-[#51c1a9] bg-white' : 'border-gray-200 bg-gray-50'}
      transition-all duration-300 hover:shadow-md
    `}>
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16">
          <img
            src={badge.imageUrl}
            alt={badge.name}
            className={`w-full h-full object-contain ${!badge.earned && 'opacity-50 grayscale'}`}
          />
          {badge.earned && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#51c1a9] rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-900">{badge.name}</h3>
          <p className="text-sm text-gray-500">{badge.description}</p>
          <div className="mt-2">
            <Progress 
              value={progressPercentage} 
              style={{ '--progress-foreground': badge.earned ? '#51c1a9' : '#94a3b8' } as React.CSSProperties}
            />
            <p className="text-xs text-gray-500 mt-1">
              {badge.progress} / {badge.requiredAmount}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AchievementShowcase() {
  const [selectedCategory, setSelectedCategory] = React.useState<Badge['category']>('streak')
  const [badges, setBadges] = React.useState<Record<Badge['category'], Badge[]>>({
    streak: [],
    calls: [],
    activity: [],
    league: []
  })
  const [isLoading, setIsLoading] = React.useState(true)

  const searchParams = useSearchParams()
  const memberId = searchParams.get('memberId')

  React.useEffect(() => {
    if (memberId) {
      fetchBadges()
    }
  }, [memberId])

  const fetchBadges = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/achievements?memberId=${memberId}`)
      const data = await response.json()
      
      if (data.badges) {
        setBadges(data.badges)
      }
    } catch (error) {
      console.error('Error fetching badges:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="animate-pulse">Loading...</div>
  }

  return (
    <Card className="bg-white shadow-lg">
      <CardContent className="p-4">
        <h2 className="text-[25px] font-bold text-[#556bc7] font-montserrat text-center mb-4">
          Achievements
        </h2>
        
        <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as Badge['category'])}>
          <TabsList className="w-full grid grid-cols-4 bg-gray-50/50 p-1.5 rounded-full mb-4">
            <TabsTrigger value="streak">Streaks</TabsTrigger>
            <TabsTrigger value="calls">Calls</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="league">League</TabsTrigger>
          </TabsList>

          <div className="space-y-4">
            {badges[selectedCategory].map((badge) => (
              <BadgeCard key={badge.id} badge={badge} />
            ))}
            {badges[selectedCategory].length === 0 && (
              <div className="text-center text-gray-500 py-8">
                No badges in this category yet
              </div>
            )}
          </div>
        </Tabs>
      </CardContent>
    </Card>
  )
}
