import { createPool } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

type Badge = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  earned: boolean;
  earnedDate?: string;
  progress: number;
  requiredAmount: number;
  category: 'streak' | 'calls' | 'activity' | 'league';
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get('memberId');
    
    if (!memberId) {
      return NextResponse.json({ error: 'Member ID required' }, { status: 400 });
    }

    const pool = createPool({
      connectionString: process.env.POSTGRES_URL
    });

    const { rows } = await pool.sql`
      WITH UserStats AS (
        SELECT 
          MAX(current_streak) as max_streak,
          COUNT(*) as total_calls,
          COUNT(*) FILTER (WHERE DATE(session_date) = CURRENT_DATE) as daily_calls,
          COUNT(*) FILTER (WHERE session_date >= DATE_TRUNC('week', CURRENT_DATE)) as weekly_calls,
          COUNT(*) FILTER (WHERE session_date >= DATE_TRUNC('month', CURRENT_DATE)) as monthly_calls
        FROM user_activity
        WHERE user_id = ${memberId}
      ),
      WeeklyRank AS (
        SELECT 
          CASE 
            WHEN rank = 1 THEN 'gold'
            WHEN rank = 2 THEN 'silver'
            WHEN rank = 3 THEN 'bronze'
            ELSE null
          END as league_badge
        FROM (
          SELECT 
            user_id,
            RANK() OVER (ORDER BY SUM(points) DESC) as rank
          FROM user_activity
          WHERE session_date >= DATE_TRUNC('week', CURRENT_DATE)
          GROUP BY user_id
        ) rankings
        WHERE user_id = ${memberId}
      )
      SELECT *, WeeklyRank.league_badge
      FROM UserStats, WeeklyRank;
    `;

    const stats = rows[0];
    
    const streakBadges = [
      { id: 'streak-5', name: '5 Day Streak', description: '5 days in a row', imageUrl: '/badges/streak-5.png', earned: false, progress: stats.max_streak, requiredAmount: 5, category: 'streak' as const },
      { id: 'streak-10', name: '10 Day Streak', description: '10 days in a row', imageUrl: '/badges/streak-10.png', earned: false, progress: stats.max_streak, requiredAmount: 10, category: 'streak' as const },
      { id: 'streak-30', name: '30 Day Streak', description: '30 days in a row', imageUrl: '/badges/streak-30.png', earned: false, progress: stats.max_streak, requiredAmount: 30, category: 'streak' as const },
      { id: 'streak-90', name: '90 Day Streak', description: '90 days in a row', imageUrl: '/badges/streak-90.png', earned: false, progress: stats.max_streak, requiredAmount: 90, category: 'streak' as const },
      { id: 'streak-180', name: '180 Day Streak', description: '180 days in a row', imageUrl: '/badges/streak-180.png', earned: false, progress: stats.max_streak, requiredAmount: 180, category: 'streak' as const },
      { id: 'streak-365', name: '365 Day Streak', description: '365 days in a row', imageUrl: '/badges/streak-365.png', earned: false, progress: stats.max_streak, requiredAmount: 365, category: 'streak' as const }
    ].map(badge => ({
      ...badge,
      earned: stats.max_streak >= badge.requiredAmount
    }));

    const callBadges = [
      { id: 'calls-10', name: '10 Calls', description: '10 total calls', imageUrl: '/badges/calls-10.png', earned: false, progress: stats.total_calls, requiredAmount: 10, category: 'calls' as const },
      { id: 'calls-25', name: '25 Calls', description: '25 total calls', imageUrl: '/badges/calls-25.png', earned: false, progress: stats.total_calls, requiredAmount: 25, category: 'calls' as const },
      { id: 'calls-50', name: '50 Calls', description: '50 total calls', imageUrl: '/badges/calls-50.png', earned: false, progress: stats.total_calls, requiredAmount: 50, category: 'calls' as const }
    ].map(badge => ({
      ...badge,
      earned: stats.total_calls >= badge.requiredAmount
    }));

    const activityBadges = [
      { id: 'daily-10', name: '10 Daily', description: '10 calls in a day', imageUrl: '/badges/daily-10.png', earned: false, progress: stats.daily_calls, requiredAmount: 10, category: 'activity' as const },
      { id: 'weekly-50', name: '50 Weekly', description: '50 calls in a week', imageUrl: '/badges/weekly-50.png', earned: false, progress: stats.weekly_calls, requiredAmount: 50, category: 'activity' as const },
      { id: 'monthly-100', name: '100 Monthly', description: '100 calls in a month', imageUrl: '/badges/monthly-100.png', earned: false, progress: stats.monthly_calls, requiredAmount: 100, category: 'activity' as const }
    ].map(badge => ({
      ...badge,
      earned: 
        (badge.id === 'daily-10' && stats.daily_calls >= 10) ||
        (badge.id === 'weekly-50' && stats.weekly_calls >= 50) ||
        (badge.id === 'monthly-100' && stats.monthly_calls >= 100)
    }));

    const leagueBadges: Badge[] = [];
    if (stats.league_badge) {
      leagueBadges.push({
        id: `league-${stats.league_badge}`,
        name: `${stats.league_badge.charAt(0).toUpperCase() + stats.league_badge.slice(1)} League`,
        description: `${stats.league_badge} badge for weekly performance`,
        imageUrl: `/badges/league-${stats.league_badge}.png`,
        earned: true,
        progress: 1,
        requiredAmount: 1,
        category: 'league' as const
      });
    }

    return NextResponse.json({
      badges: {
        streak: streakBadges,
        calls: callBadges,
        activity: activityBadges,
        league: leagueBadges
      }
    });

  } catch (error) {
    console.error('Error getting achievements:', error);
    return NextResponse.json({ error: 'Failed to get achievements' }, { status: 500 });
  }
}
