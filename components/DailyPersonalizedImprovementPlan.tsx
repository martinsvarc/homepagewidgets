'use client'
import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const improvementTasks = [
  "Complete these 3 price negotiation scenarios by Friday",
  "Practice with AI bot on product X for 20 minutes daily",
  "Role-play these specific customer personas with detailed feedback"
]

const taskColors = ["#fbb351", "#50c2aa", "#546bc8"]

interface ImprovementTaskProps {
  task: string;
  color: string;
}

function ImprovementTask({ task, color }: ImprovementTaskProps) {
  const [isChecked, setIsChecked] = React.useState(false)

  return (
    <div 
      className="flex items-start gap-3 p-4 rounded-[20px] transition-all duration-300"
      style={{ backgroundColor: color }}
    >
      <div className="relative flex items-center justify-center pt-1">
        <Checkbox 
          checked={isChecked}
          onCheckedChange={(checked) => setIsChecked(checked as boolean)}
          className="h-5 w-5 rounded-lg border-2 border-white/80 data-[state=checked]:bg-transparent data-[state=checked]:border-white"
        />
      </div>
      <div className="flex-1 text-sm font-medium text-white leading-tight">
        {task}
      </div>
    </div>
  )
}

const MemoizedImprovementTask = React.memo(ImprovementTask)

export default function DailyPersonalizedImprovementPlan() {
  const [isRefreshing, setIsRefreshing] = React.useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  return (
    <Card className="bg-white shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[25px] font-bold text-[#546bc8] font-montserrat text-center flex-1">
            Daily Personalized Plan
          </h2>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="w-8 h-8 ml-2"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                >
                  <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span className="sr-only">Refresh improvement plan</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p className="text-xs">Updates Automatically Every 24 Hours</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="space-y-3">
          {improvementTasks.map((task, index) => (
            <MemoizedImprovementTask 
              key={index} 
              task={task} 
              color={taskColors[index % taskColors.length]}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
