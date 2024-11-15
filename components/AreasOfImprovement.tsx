'use client'
import * as React from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useSearchParams } from 'next/navigation'

interface Improvement {
  text: string
  color: string
}

export default function AreasOfImprovement() {
  const [improvements, setImprovements] = React.useState<Improvement[]>([])
  const [isRefreshing, setIsRefreshing] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)
  
  const searchParams = useSearchParams()
  const memberId = searchParams.get('memberId')

  const fetchImprovements = React.useCallback(async () => {
    if (!memberId) return
    
    try {
      setIsRefreshing(true)
      const response = await fetch(`/api/areas-improvement?memberId=${memberId}`)
      const data = await response.json()
      
      if (data.improvements) {
        setImprovements(data.improvements)
      }
    } catch (error) {
      console.error('Error fetching improvements:', error)
    } finally {
      setIsRefreshing(false)
      setIsLoading(false)
    }
  }, [memberId])

  React.useEffect(() => {
    fetchImprovements()
  }, [fetchImprovements])

  if (isLoading) {
    return <div className="animate-pulse">Loading...</div>
  }

  return (
    <Card className="bg-white shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[25px] font-bold text-[#546bc8] font-montserrat text-center flex-1">
            Areas of Improvement
          </h2>
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-8 h-8 ml-2"
            onClick={fetchImprovements}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="sr-only">Refresh improvements</span>
          </Button>
        </div>
        <div className="space-y-3">
          {improvements.map((improvement, index) => (
            <div 
              key={index}
              className="flex items-start gap-3 p-4 rounded-[20px] transition-all duration-300"
              style={{ backgroundColor: improvement.color }}
            >
              <TrendingUp className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
              <span className="flex-1 text-sm font-medium text-white leading-tight">
                {improvement.text}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
