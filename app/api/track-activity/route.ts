// app/api/track-activity/route.ts
import { createPool } from '@vercel/postgres';
import { NextResponse } from 'next/server';

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

    // Get user's activity data
    const { rows } = await pool.sql`
      WITH date_counts AS (
        SELECT 
          DATE(session_date) as practice_date,
          COUNT(*) as daily_count,
          current_streak,
          longest_streak
        FROM user_activity
        WHERE user_id = ${memberId}
        GROUP BY DATE(session_date), current_streak, longest_streak
      )
      SELECT 
        ARRAY_AGG(practice_date::text) as active_dates,
        MAX(current_streak) as current_streak,
        MAX(longest_streak) as longest_streak,
        COUNT(DISTINCT practice_date) as total_active_days
      FROM date_counts;
    `;

    if (rows.length === 0) {
      return NextResponse.json({
        activeDates: [],
        currentStreak: 0,
        longestStreak: 0,
        totalActiveDays: 0
      });
    }

    return NextResponse.json({
      activeDates: rows[0].active_dates || [],
      currentStreak: parseInt(rows[0].current_streak) || 0,
      longestStreak: parseInt(rows[0].longest_streak) || 0,
      totalActiveDays: parseInt(rows[0].total_active_days) || 0
    });
  } catch (error) {
    console.error('Error getting activity data:', error);
    return NextResponse.json({ error: 'Failed to get activity data' }, { status: 500 });
  }
}

// Handle new activity records and update streaks
export async function POST(request: Request) {
  try {
    const { memberId, points = 1 } = await request.json();
    
    if (!memberId) {
      return NextResponse.json({ error: 'Member ID required' }, { status: 400 });
    }

    const pool = createPool({
      connectionString: process.env.POSTGRES_URL
    });

    // Insert new activity and update streaks
    const { rows } = await pool.sql`
      WITH new_activity AS (
        INSERT INTO user_activity (
          user_id,
          session_date,
          points
        )
        VALUES (
          ${memberId},
          CURRENT_TIMESTAMP,
          ${points}
        )
        RETURNING *
      ),
      streak_calculation AS (
        SELECT 
          CASE 
            WHEN MAX(session_date) >= CURRENT_DATE - INTERVAL '1 day'
            THEN COALESCE(current_streak, 0) + 1
            ELSE 1
          END as new_current_streak,
          GREATEST(
            COALESCE(longest_streak, 0),
            CASE 
              WHEN MAX(session_date) >= CURRENT_DATE - INTERVAL '1 day'
              THEN COALESCE(current_streak, 0) + 1
              ELSE 1
            END
          ) as new_longest_streak
        FROM user_activity
        WHERE user_id = ${memberId}
      )
      UPDATE user_activity
      SET 
        current_streak = streak_calculation.new_current_streak,
        longest_streak = streak_calculation.new_longest_streak
      FROM streak_calculation
      WHERE user_id = ${memberId}
      RETURNING current_streak, longest_streak;
    `;

    return NextResponse.json({
      success: true,
      currentStreak: rows[0]?.current_streak || 1,
      longestStreak: rows[0]?.longest_streak || 1
    });
  } catch (error) {
    console.error('Error recording activity:', error);
    return NextResponse.json({ error: 'Failed to record activity' }, { status: 500 });
  }
}
