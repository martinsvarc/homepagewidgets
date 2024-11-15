'use client'
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Medal, Trophy, Award, Target } from "lucide-react";

const getProgressColor = (progress: number) => {
  if (progress === 100) return '#546bc8' // Diamond blue
  if (progress >= 70) return '#50c2aa'   // Green
  if (progress >= 40) return '#fb9851'   // Orange
  return '#ef4444'                       // Red
}

interface Achievement {
  icon: React.ReactNode;
  level: string;
  progress: number;
  image?: string;
  days?: number;
  calls?: number;
  sessions?: number;
}

interface Category {
  id: string;
  name: string;
  items: Achievement[];
}

export default function AchievementShowcase() {
  const [activeCategory, setActiveCategory] = React.useState("practice-streak");

  const categories: Category[] = [
    {
      id: "practice-streak",
      name: "Practice Streak",
      items: [
        { 
          icon: <Medal className="w-5 h-5" />, 
          level: "5 Day Streak", 
          progress: 100,
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5-day-streak.png",
          days: 5
        },
        { 
          icon: <Medal className="w-5 h-5" />, 
          level: "10 Day Streak", 
          progress: 100,
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/10-day-streak.png",
          days: 10
        },
        { 
          icon: <Medal className="w-5 h-5" />, 
          level: "30 Day Streak", 
          progress: 80,
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/30-day-streak.png",
          days: 30
        },
        { 
          icon: <Medal className="w-5 h-5" />, 
          level: "90 Day Streak", 
          progress: 45,
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/90-day-streak.png",
          days: 90
        },
        { 
          icon: <Medal className="w-5 h-5" />, 
          level: "180 Day Streak", 
          progress: 20,
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/180-day-streak.png",
          days: 180
        },
        { 
          icon: <Medal className="w-5 h-5" />, 
          level: "365 Day Streak", 
          progress: 5,
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/365-day-streak.png",
          days: 365
        }
      ]
    },
    {
      id: "completed-calls",
      name: "Completed Calls",
      items: [
        { icon: <Trophy className="w-5 h-5" />, level: "10 Calls", progress: 100, image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/10-calls.png", calls: 10 },
        { icon: <Trophy className="w-5 h-5" />, level: "25 Calls", progress: 100, image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/25-calls.png", calls: 25 },
        { icon: <Trophy className="w-5 h-5" />, level: "50 Calls", progress: 100, image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/50-calls.png", calls: 50 },
        { icon: <Trophy className="w-5 h-5" />, level: "100 Calls", progress: 80, image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/100-calls.png", calls: 100 },
        { icon: <Trophy className="w-5 h-5" />, level: "250 Calls", progress: 60, image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/250-calls.png", calls: 250 },
        { icon: <Trophy className="w-5 h-5" />, level: "500 Calls", progress: 40, image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/500-calls.png", calls: 500 },
        { icon: <Trophy className="w-5 h-5" />, level: "750 Calls", progress: 20, image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/750-calls.png", calls: 750 },
        { icon: <Trophy className="w-5 h-5" />, level: "1000 Calls", progress: 10, image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1000-calls.png", calls: 1000 },
        { icon: <Trophy className="w-5 h-5" />, level: "1500 Calls", progress: 5, image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1500-calls.png", calls: 1500 },
        { icon: <Trophy className="w-5 h-5" />, level: "2500 Calls", progress: 0, image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2500-calls.png", calls: 2500 }
      ]
    },
    {
      id: "activity-goals",
      name: "Activity Goals",
      items: [
        { 
          icon: <Target className="w-5 h-5" />, 
          level: "10 Sessions in a Day", 
          progress: 80,
          sessions: 10
        },
        { 
          icon: <Target className="w-5 h-5" />, 
          level: "50 Sessions in a Week", 
          progress: 60,
          sessions: 50
        },
        { 
          icon: <Target className="w-5 h-5" />, 
          level: "100 Sessions in a Month", 
          progress: 40,
          sessions: 100
        }
      ]
    },
    {
      id: "league-places",
      name: "League Places",
      items: [
        { 
          icon: <Award className="w-5 h-5" />, 
          level: "Bronze League", 
          progress: 100,
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bronze-league.png"
        },
        { 
          icon: <Award className="w-5 h-5" />, 
          level: "Silver League", 
          progress: 75,
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/silver-league.png"
        },
        { 
          icon: <Award className="w-5 h-5" />, 
          level: "Gold League", 
          progress: 45,
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/gold-league.png"
        }
      ]
    }
  ];

  const activeItems = categories.find(cat => cat.id === activeCategory)?.items || [];

  return (
    <Card className="bg-white shadow-lg h-[280px]">
      <CardContent className="p-3">
        <h2 className="text-[25px] font-bold text-[#556bc7] font-montserrat text-center mb-3">
          Achievement Showcase
        </h2>
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
          <TabsList className="w-full flex flex-wrap justify-between bg-gray-50/50 p-1 rounded-full gap-1">
            {categories.map((category) => (
              <TabsTrigger 
                key={category.id}
                value={category.id} 
                className="flex-1 relative z-10 rounded-full px-2 py-1 text-xs font-medium text-gray-600 transition-all duration-300 hover:text-gray-900 data-[state=active]:bg-[#fbb350] data-[state=active]:text-white data-[state=active]:shadow-[0_8px_16px_-4px_rgba(251,179,80,0.3)]"
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="mt-3 space-y-2 overflow-auto max-h-[160px] custom-scrollbar">
          {activeItems.map((badge, index) => (
            <TooltipProvider key={index}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    {badge.image ? (
                      <div className="w-6 h-6">
                        <img 
                          src={badge.image} 
                          alt={badge.level}
                          className={`w-full h-full object-contain ${badge.progress < 100 ? 'opacity-50 grayscale' : ''}`}
                        />
                      </div>
                    ) : (
                      <div style={{ color: getProgressColor(badge.progress) }}>
                        {badge.icon}
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium">{badge.level}</span>
                        <span className="text-gray-500">{badge.progress}%</span>
                      </div>
                      <Progress 
                        value={badge.progress} 
                        className="h-1"
                        style={{
                          backgroundColor: '#f2f3f9',
                          '--progress-background': '#f2f3f9',
                          '--progress-foreground': getProgressColor(badge.progress)
                        } as React.CSSProperties}
                      />
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">
                    {badge.days 
                      ? `${badge.level} - ${badge.progress}% Complete (${badge.days} days)`
                      : badge.calls
                      ? `${badge.level} - ${badge.progress}% Complete (${badge.calls} calls)`
                      : badge.sessions
                      ? `${badge.level} - ${badge.progress}% Complete (${badge.sessions} sessions)`
                      : `${badge.level} - ${badge.progress}% Complete`}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
