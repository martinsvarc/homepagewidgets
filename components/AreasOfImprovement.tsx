'use client'
import * as React from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const mockImprovements = [
  "Investor should ask clearer questions on final terms and conditions",
  "Clarify lease terms better with detailed explanations",
  "Set a specific follow-up plan to keep hold times low and maintain engagement"
];

export default function AreasOfImprovement() {
  const [improvements, setImprovements] = React.useState(mockImprovements)
  const [isRefreshing, setIsRefreshing] = React.useState(false)

  const refreshImprovements = () => {
    setIsRefreshing(true)
    // Simulate refresh by shuffling the improvements
    setImprovements([...improvements].sort(() => Math.random() - 0.5))
    setTimeout(() => setIsRefreshing(false), 500)
  }

  const colors = ['#fbb351', '#50c2aa', '#546bc8']

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
            onClick={refreshImprovements}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        <div className="space-y-3">
          {improvements.map((improvement, index) => {
            const colorIndex = index % colors.length;
            return (
              <div 
                key={index}
                className="flex items-start gap-3 p-4 rounded-[20px] transition-all duration-300"
                style={{ backgroundColor: colors[colorIndex] }}
              >
                <TrendingUp className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                <span className="flex-1 text-sm font-medium text-white leading-tight">
                  {improvement}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  )
}
