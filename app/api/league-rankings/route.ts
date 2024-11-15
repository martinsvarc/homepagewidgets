import { createPool } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get('memberId');
    const period = searchParams.get('period') || 'weekly';
    
    if (!memberId) {
      return NextResponse.json({ error: 'Member ID required' }, { status: 400 });
    }

    const pool = createPool({
      connectionString: process.env.POSTGRES_URL
    });

    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());

    let query = '';
    let queryParams: any[] = [];

    const baseRankingQuery = `
      WITH UserRankings AS (
        SELECT 
          ua.user_id,
          ua.user_name,
          ua.profile_picture_url,
          ua.badges,
          SUM(ua.points) as total_points,
          ROW_NUMBER() OVER (ORDER BY SUM(ua.points) DESC) as rank,
          COUNT(DISTINCT DATE_TRUNC('day', ua.session_date)) as days_active
        FROM user_activity ua
        WHERE 1=1
    `;

    const chartQuery = `
      WITH DailyPoints AS (
        SELECT 
          DATE_TRUNC('day', session_date) as day,
          SUM(points) as user_points
        FROM user_activity
        WHERE user_id = $1 AND session_date >= $2
        GROUP BY DATE_TRUNC('day', session_date)
      ),
      TopPoints AS (
        SELECT 
          DATE_TRUNC('day', session_date) as day,
          MAX(daily_points) as top_points
        FROM (
          SELECT 
            DATE_TRUNC('day', session_date) as session_date,
            user_id,
            SUM(points) as daily_points
          FROM user_activity
          WHERE session_date >= $2
          GROUP BY DATE_TRUNC('day', session_date), user_id
        ) daily_user_points
        GROUP BY DATE_TRUNC('day', session_date)
      )
      SELECT 
        TO_CHAR(d.day, 'Dy') as time,
        COALESCE(dp.user_points, 0) as user_points,
        COALESCE(tp.top_points, 0) as top_user_points
      FROM 
        generate_series(
          $2::timestamp, 
          $2::timestamp + interval '6 days',
          interval '1 day'
        ) d(day)
      LEFT JOIN DailyPoints dp ON d.day = dp.day
      LEFT JOIN TopPoints tp ON d.day = tp.day
      ORDER BY d.day;
    `;

    switch (period) {
      case 'weekly': {
        query = `
          ${baseRankingQuery}
          AND ua.session_date >= $1
          GROUP BY ua.user_id, ua.user_name, ua.profile_picture_url, ua.badges
        )
        SELECT * FROM UserRankings
        WHERE rank <= 3 OR user_id = $2
        ORDER BY rank ASC;
        `;
        queryParams = [startOfWeek.toISOString(), memberId];
        break;
      }
      
      case 'allTime': {
        query = `
          ${baseRankingQuery}
          GROUP BY ua.user_id, ua.user_name, ua.profile_picture_url, ua.badges
        )
        SELECT * FROM UserRankings
        WHERE rank <= 3 OR user_id = $1
        ORDER BY rank ASC;
        `;
        queryParams = [memberId];
        break;
      }
      
      case 'team': {
        const teamResult = await pool.query(
          'SELECT team_id FROM user_activity WHERE user_id = $1 LIMIT 1',
          [memberId]
        );
        
        if (!teamResult.rows[0]?.team_id) {
          return NextResponse.json({ error: 'No team found' }, { status: 404 });
        }

        const teamId = teamResult.rows[0].team_id;
        
        query = `
          ${baseRankingQuery}
          AND ua.team_id = $1
          GROUP BY ua.user_id, ua.user_name, ua.profile_picture_url, ua.badges
        )
        SELECT * FROM UserRankings
        WHERE rank <= 3 OR user_id = $2
        ORDER BY rank ASC;
        `;
        queryParams = [teamId, memberId];
        break;
      }
      
      default:
        return NextResponse.json({ error: 'Invalid period' }, { status: 400 });
    }

    const [rankingsResult, chartResult] = await Promise.all([
      pool.query(query, queryParams),
      pool.query(chartQuery, [memberId, startOfWeek.toISOString()])
    ]);

    return NextResponse.json({
      rankings: rankingsResult.rows,
      chartData: chartResult.rows
    });

  } catch (error) {
    console.error('Error getting league rankings:', error);
    return NextResponse.json({ error: 'Failed to get rankings' }, { status: 500 });
  }
}
