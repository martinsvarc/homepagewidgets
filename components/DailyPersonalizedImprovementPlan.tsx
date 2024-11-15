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
import { useSearchParams } from 'next/navigation'

interface Task {
  task: string
  color: string
}

interface ImprovementTaskProps {
  task: Task
  onComplete: (completed: boolean) => void
}

function ImprovementTask({ task, onComplete }: ImprovementTaskProps) {
  const [isChecked, setIsChecked] = React.useState(false)

  const handleCheck = (checked: boolean) => {
    setIsChecked(checked)
    onComplete(checked)
  }

  return (
    <div 
      className="flex items-start gap-3 p-4 rounded-[20px] transition-all duration-300"
      style={{ backgroundColor: task.color }}
    >
      <div className="relative flex items-center justify-center pt-1">
        <Checkbox 
          checked={isChecked}
          onCheckedChange={handleCheck}
          className="h-5 w-5 rounded-lg border-2 border-white/80 data-[state=checked]:bg-transparent data-[state=checked]:border-white"
        />
      </div>
      <div className="flex-1 text-sm font-medium text-white leading-tight">
        {task.task}
      </div>
    </div>
  )
}

const MemoizedImprovementTask = React.memo(ImprovementTask)

export default function DailyPersonalizedImprovementPlan() {
  const [tasks, setTasks] = React.useState<Task[]>([])
  const [isRefreshing, setIsRefreshing] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)
  
  const searchParams = useSearchParams()
  const memberId = searchParams.get('memberId')

  const fetchTasks = React.useCallback(async () => {
    if (!memberId) return
    
    try {
      setIsRefreshing(true)
      const response = await fetch(`/api/improvement-plan?memberId=${memberId}`)
      const data = await response.json()
      
      if (data.tasks) {
        setTasks(data.tasks)
      }
    } catch (error) {
      console.error('Error fetching improvement plan:', error)
    } finally {
      setIsRefreshing(false)
      setIsLoading(false)
    }
  }, [memberId])

  React.useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const handleTaskComplete = async (index: number, completed: boolean) => {
    if (!memberId) return

    try {
      // Record task completion in the database
      await fetch('/api/improvement-plan/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          memberId,
          taskIndex: index,
          completed
        })
      })
    } catch (error) {
      console.error('Error recording task completion:', error)
    }
  }

  if (isLoading) {
    return <div className="animate-pulse">Loading...</div>
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
                  onClick={() => fetchTasks()}
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
          {tasks.map((task, index) => (
            <MemoizedImprovementTask 
              key={index} 
              task={task}
              onComplete={(completed) => handleTaskComplete(index, completed)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
