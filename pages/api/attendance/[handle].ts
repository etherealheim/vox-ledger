import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/src/db';
import { politicians, votes, votingSessions } from '@/src/db/schema';
import { eq, and, isNotNull, not } from 'drizzle-orm';

interface MonthlyAttendance {
    month: string;
    attendancePercentage: number;
}

interface Session {
    sessionId: number;
    date: string | null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { handle } = req.query;

    if (typeof handle !== 'string') {
        return res.status(400).json({ error: 'Invalid handle parameter' });
    }

    try {
        // Fetch all voting sessions with non-null dates
        const allSessions: Session[] = await db
            .select({
                sessionId: votingSessions.sessionId,
                date: votingSessions.date,
            })
            .from(votingSessions)
            .where(isNotNull(votingSessions.date)); // No date limitation

        // Fetch all voting sessions where the politician participated (excluding 'Not logged in')
        const participatedSessions: Session[] = await db
            .select({
                sessionId: votingSessions.sessionId,
                date: votingSessions.date,
            })
            .from(votingSessions)
            .innerJoin(votes, eq(votes.votingSessionId, votingSessions.id))
            .innerJoin(politicians, eq(votes.politicianId, politicians.id))
            .where(
                and(
                    eq(politicians.handle, handle),
                    isNotNull(votingSessions.date),
                    not(eq(votes.vote, 'Not logged in')) // Exclude 'Not logged in' votes
                )
            );

        // Group sessions by month
        const sessionsByMonth: Record<string, { total: number; participated: number }> = {};

        allSessions.forEach((session: Session) => {
            if (session.date) {
                const dateObj = new Date(session.date);
                const month = dateObj.toLocaleString('default', { month: 'long', year: 'numeric' }); // Group by month & year
                if (!sessionsByMonth[month]) {
                    sessionsByMonth[month] = { total: 0, participated: 0 };
                }
                sessionsByMonth[month].total += 1;
            }
        });

        participatedSessions.forEach((session: Session) => {
            if (session.date) {
                const dateObj = new Date(session.date);
                const month = dateObj.toLocaleString('default', { month: 'long', year: 'numeric' });
                if (sessionsByMonth[month]) {
                    sessionsByMonth[month].participated += 1;
                }
            }
        });

        // Calculate attendance percentage per month
        const monthlyAttendance: MonthlyAttendance[] = Object.entries(sessionsByMonth).map(
            ([month, data]) => ({
                month,
                attendancePercentage: data.total > 0
                    ? parseFloat(((data.participated / data.total) * 100).toFixed(2))
                    : 0,
            })
        );

        // Sort the data chronologically
        monthlyAttendance.sort((a, b) => new Date(`01 ${a.month}`).getTime() - new Date(`01 ${b.month}`).getTime());

        res.status(200).json(monthlyAttendance);
    } catch (error) {
        console.error('Error fetching attendance data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
