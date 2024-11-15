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

    // Analyze user's performance data to identify areas needing improvement
    const { rows } = await pool.sql`
      WITH UserPerformance AS (
        SELECT 
          user_id,
          AVG(points) as avg_points,
          COUNT(*) as total_sessions,
          current_streak,
          EXTRACT(HOUR FROM session_date) as hour_of_day
        FROM user_activity
        WHERE user_id = ${memberId}
        GROUP BY user_id, current_streak, session_date
      ),
      TimeAnalysis AS (
        SELECT 
          user_id,
          hour_of_day,
          COUNT(*) as sessions_in_hour
        FROM UserPerformance
        GROUP BY user_id, hour_of_day
        ORDER BY sessions_in_hour DESC
        LIMIT 1
      )
      SELECT 
        up.avg_points,
        up.total_sessions,
        up.current_streak,
        ta.hour_of_day as peak_hour
      FROM UserPerformance up
      CROSS JOIN TimeAnalysis ta
      LIMIT 1;
    `;

    // Generate improvement suggestions based on performance data
    const performance = rows[0];
    const improvements = [];

    if (performance) {
      // Points-based improvement
      if (performance.avg_points < 80) {
        improvements.push({
          text: "Focus on clearer question formulation and detailed explanations",
          color: "#fbb351"
        });
      }

      // Consistency-based improvement
      if (performance.current_streak < 5) {
        improvements.push({
          text: "Establish a regular practice schedule to maintain momentum",
          color: "#50c2aa"
        });
      }

      // Volume-based improvement
      if (performance.total_sessions < 50) {
        improvements.push({
          text: "Increase session frequency to build expertise faster",
          color: "#546bc8"
        });
      }
    }

    // Ensure we always have 3 improvements
    const defaultImprovements = [
      {
        text: "Review and practice core communication techniques",
        color: "#fbb351"
      },
      {
        text: "Focus on maintaining consistent engagement levels",
        color: "#50c2aa"
      },
      {
        text: "Work on timely follow-up and response patterns",
        color: "#546bc8"
      }
    ];

    while (improvements.length < 3) {
      improvements.push(defaultImprovements[improvements.length]);
    }

    return NextResponse.json({ improvements });

  } catch (error) {
    console.error('Error getting areas of improvement:', error);
    return NextResponse.json({ error: 'Failed to get improvement areas' }, { status: 500 });
  }
}
