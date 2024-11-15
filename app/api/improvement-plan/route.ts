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

    // Get user's performance data and generate personalized tasks
    const { rows } = await pool.sql`
      WITH UserStats AS (
        SELECT 
          COUNT(*) as total_sessions,
          AVG(points) as avg_points,
          MAX(session_date) as last_session
        FROM user_activity
        WHERE user_id = ${memberId}
      )
      SELECT 
        CASE 
          WHEN total_sessions < 10 THEN 'beginner'
          WHEN total_sessions < 50 THEN 'intermediate'
          ELSE 'advanced'
        END as user_level,
        avg_points,
        last_session
      FROM UserStats;
    `;

    // Based on user level, return appropriate tasks
    const userLevel = rows[0]?.user_level || 'beginner';
    
    let tasks = [];
    switch (userLevel) {
      case 'beginner':
        tasks = [
          {
            task: "Complete these 3 price negotiation scenarios by Friday",
            color: "#fbb351"
          },
          {
            task: "Practice with AI bot on product X for 20 minutes daily",
            color: "#50c2aa"
          },
          {
            task: "Role-play these specific customer personas with detailed feedback",
            color: "#546bc8"
          }
        ];
        break;
      case 'intermediate':
        tasks = [
          {
            task: "Handle 5 complex pricing scenarios with multiple stakeholders",
            color: "#fbb351"
          },
          {
            task: "Lead a group training session on advanced negotiation",
            color: "#50c2aa"
          },
          {
            task: "Complete advanced product knowledge assessment",
            color: "#546bc8"
          }
        ];
        break;
      case 'advanced':
        tasks = [
          {
            task: "Mentor 2 team members on negotiation techniques",
            color: "#fbb351"
          },
          {
            task: "Create training materials for new scenario types",
            color: "#50c2aa"
          },
          {
            task: "Contribute to best practices documentation",
            color: "#546bc8"
          }
        ];
        break;
    }

    return NextResponse.json({
      tasks,
      userLevel,
      lastUpdated: rows[0]?.last_session
    });

  } catch (error) {
    console.error('Error getting improvement plan:', error);
    return NextResponse.json({ error: 'Failed to get improvement plan' }, { status: 500 });
  }
}
