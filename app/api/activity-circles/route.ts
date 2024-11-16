import { createPool } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

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
    // Calculate session counts for different time periods
    const { rows } = await pool.sql`
      WITH DateRanges AS (
        SELECT
          CURRENT_DATE as today,
          DATE_TRUNC('week', CURRENT_DATE)::DATE as week_start,
          DATE_TRUNC('month', CURRENT_DATE)::DATE as month_start,
          DATE_TRUNC('year', CURRENT_DATE)::DATE as year_start
      )
      SELECT 
        COUNT(*) FILTER (WHERE DATE(session_date) = CURRENT_DATE) as daily_sessions,
        COUNT(*) FILTER (WHERE session_date >= week_start) as weekly_sessions,
        COUNT(*) FILTER (WHERE session_date >= month_start) as monthly_sessions,
        COUNT(*) FILTER (WHERE session_date >= year_start) as yearly_sessions
      FROM user_activity, DateRanges
      WHERE user_id = ${memberId};
    `;
    // Format data for the circles
    const sessions = [
      {
        count: parseInt(rows[0].daily_sessions) || 0,
        max: 10,
        label: "today",
        color: "#546bc8"
      },
      {
        count: parseInt(rows[0].weekly_sessions) || 0,
        max: 50,
        label: "this week",
        color: "#50c2aa"
      },
      {
        count: parseInt(rows[0].monthly_sessions) || 0,
        max: 100,
        label: "this month",
        color: "#fb9851"
      },
      {
        count: parseInt(rows[0].yearly_sessions) || 0,
        max: 1000,
        label: "this year",
        color: "#fbb351"
      }
    ];
    return NextResponse.json({ sessions });
  } catch (error) {
    console.error('Error getting activity data:', error);
    return NextResponse.json({ error: 'Failed to get activity data' }, { status: 500 });
  }
}
