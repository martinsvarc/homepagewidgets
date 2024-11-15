'use client'
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, CalendarDays, CalendarRange, ChevronLeft, ChevronRight } from 'lucide-react';

interface CircularProgressProps {
  value: number;
  max: number;
  color: string;
  label: string;
  icon: React.ReactNode;
}

const CircularProgress: React.FC<CircularProgressProps> = ({ value, max, color, label, icon }) => {
  const radius = 55;
  const strokeWidth = 3;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / max) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center">
      <div 
        className="relative w-[140px] h-[140px] flex items-center justify-center"
        style={{
          filter: 'drop-shadow(0px 8px 16px rgba(0, 0, 0, 0.08))'
        }}
      >
        {/* Main colored circle background */}
        <div 
          className="absolute inset-0 rounded-full"
          style={{ backgroundColor: color }}
        />
        
        {/* White progress circle */}
        <svg 
          width="140" 
          height="140" 
          className="absolute transform -rotate-90"
        >
          <circle
            stroke="white"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            r={normalizedRadius}
            cx="70"
            cy="70"
            style={{
              strokeDasharray: `${circumference} ${circumference}`,
              strokeDashoffset: strokeDashoffset,
              transition: 'stroke-dashoffset 0.5s ease-in-out',
            }}
          />
        </svg>

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <div className="flex flex-col items-center justify-center gap-1">
            <span className="text-4xl font-bold leading-none">{value}</span>
            <span className="text-sm uppercase tracking-wider leading-none text-center">
              {label.split(' ').map((word, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <br />}
                  {word}
                </React.Fragment>
              ))}
            </span>
          </div>
        </div>

        {/* Small icon circle */}
        <div 
          className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-white flex items-center justify-center"
          style={{
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
            color: color
          }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

export default function ActivityCircles() {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const sessions = [
    { 
      count: 5, 
      max: 10, 
      label: "today", 
      color: "#546bc8",
      icon: <Clock className="w-5 h-5" />
    },
    { 
      count: 18, 
      max: 50, 
      label: "this week", 
      color: "#50c2aa",
      icon: <Calendar className="w-5 h-5" />
    },
    { 
      count: 12, 
      max: 100, 
      label: "this month", 
      color: "#fb9851",
      icon: <CalendarDays className="w-5 h-5" />
    },
    { 
      count: 42, 
      max: 1000, 
      label: "this year", 
      color: "#fbb351",
      icon: <CalendarRange className="w-5 h-5" />
    }
  ];

  const nextMetric = () => {
    setCurrentIndex((prev) => (prev + 1) % sessions.length);
  };

  const prevMetric = () => {
    setCurrentIndex((prev) => (prev - 1 + sessions.length) % sessions.length);
  };

  return (
    <Card className="bg-white shadow-lg h-[280px]">
      <div className="p-4 h-full flex flex-col">
        <h2 className="text-[25px] font-bold text-[#556bc7] font-montserrat mb-4 text-center">
          Activity Circles
        </h2>
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={prevMetric}
              className="h-8 w-8 rounded-full hover:bg-gray-100"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <CircularProgress
              value={sessions[currentIndex].count}
              max={sessions[currentIndex].max}
              color={sessions[currentIndex].color}
              label={sessions[currentIndex].label}
              icon={sessions[currentIndex].icon}
            />

            <Button
              variant="ghost"
              size="icon"
              onClick={nextMetric}
              className="h-8 w-8 rounded-full hover:bg-gray-100"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Navigation dots */}
        <div className="flex justify-center gap-2 mt-4">
          {sessions.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === currentIndex 
                  ? 'bg-gray-600 w-4' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>
    </Card>
  );
}
