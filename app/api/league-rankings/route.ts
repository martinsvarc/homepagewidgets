// app/api/league-rankings/route.ts
import { createPool } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get('memberId');
    const period = searchParams.get('period') || 'weekly'; // weekly, allTime, team
    
    if (!memberId) {
      return NextResponse.json({ error: 'Member ID required' }, { status: 400 });
    }

    const pool = createPool({
      connectionString: process.env.POSTGRES_URL
    });

    let query = '';
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Start from Sunday

    switch (period) {
      case 'weekly': {
        query = `
          WITH RankedUsers AS (
            SELECT 
              user_id,
              user_name,
              profile_picture_url,
              badges,
              SUM(points) as total_points,
              ROW_NUMBER() OVER (ORDER BY SUM(points) DESC) as rank
            FROM user_activity
            WHERE session_date >= $1
            GROUP BY user_id, user_name, profile_picture_url, badges
          )
          SELECT 
            user_id,
            user_name,
            profile_picture_url,
            badges,
            total_points,
            rank
          FROM RankedUsers
          WHERE rank <= 3 OR user_id = $2
          ORDER BY rank ASC;
        `;
        return await pool.query(query, [startOfWeek.toISOString(), memberId]);
      }
      
      case 'allTime': {
        query = `
          WITH RankedUsers AS (
            SELECT 
              user_id,
              user_name,
              profile_picture_url,
              badges,
              SUM(points) as total_points,
              ROW_NUMBER() OVER (ORDER BY SUM(points) DESC) as rank
            FROM user_activity
            GROUP BY user_id, user_name, profile_picture_url, badges
          )
          SELECT 
            user_id,
            user_name,
            profile_picture_url,
            badges,
            total_points,
            rank
          FROM RankedUsers
          WHERE rank <= 3 OR user_id = $1
          ORDER BY rank ASC;
        `;
        return await pool.query(query, [memberId]);
      }
      
      case 'team': {
        const teamId = await pool.query(
          'SELECT team_id FROM user_activity WHERE user_id = $1 LIMIT 1',
          [memberId]
        );
        
        if (!teamId.rows[0]?.team_id) {
          return NextResponse.json({ error: 'No team found' }, { status: 404 });
        }

        query = `
          WITH RankedUsers AS (
            SELECT 
              user_id,
              user_name,
              profile_picture_url,
              badges,
              team_id,
              SUM(points) as total_points,
              ROW_NUMBER() OVER (PARTITION BY team_id ORDER BY SUM(points) DESC) as rank
            FROM user_activity
            WHERE team_id = $1
            GROUP BY user_id, user_name, profile_picture_url, badges, team_id
          )
          SELECT 
            user_id,
            user_name,
            profile_picture_url,
            badges,
            total_points,
            rank
          FROM RankedUsers
          WHERE rank <= 3 OR user_id = $2
          ORDER BY rank ASC;
        `;
        return await pool.query(query, [teamId.rows[0].team_id, memberId]);
      }

      default:
        return NextResponse.json({ error: 'Invalid period' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error getting league rankings:', error);
    return NextResponse.json({ error: 'Failed to get rankings' }, { status: 500 });
  }
}
