// /pages/api/attendance/[handle].ts

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
    date: string | null; // Adjust based on drizzle-orm's date handling
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { handle } = req.query;

    // Validate the 'handle' parameter
    if (typeof handle !== 'string') {
        return res.status(400).json({ error: 'Invalid handle parameter' });
    }

    try {
        // Step 1: Fetch all voting sessions with non-null dates
        const allSessions: Session[] = await db
            .select({
                sessionId: votingSessions.sessionId,
                date: votingSessions.date,
            })
            .from(votingSessions)
            .where(isNotNull(votingSessions.date));

        console.log('All Sessions:', allSessions);

        // Step 2: Fetch all voting sessions where the politician participated (excluding 'Not logged in') with non-null dates
        const participatedSessions: Session[] = await db
            .select({
                sessionId: votingSessions.sessionId,
                date: votingSessions.date,
            })
            .from(votingSessions)
            // Corrected Join: votes.votingSessionId references votingSessions.id
            .innerJoin(votes, eq(votes.votingSessionId, votingSessions.id))
            .innerJoin(politicians, eq(votes.politicianId, politicians.id))
            .where(
                and(
                    eq(politicians.handle, handle),
                    isNotNull(votingSessions.date),
                    not(eq(votes.vote, 'Not logged in')) // Exclude 'Not logged in' votes
                )
            );

        console.log('Participated Sessions:', participatedSessions);

        // Step 3: Group sessions by month
        const sessionsByMonth: Record<string, { total: number; participated: number }> = {};

        allSessions.forEach((session: Session) => {
            if (session.date) {
                const dateObj = new Date(session.date);
                if (isNaN(dateObj.getTime())) {
                    console.error(`Invalid date format for session ID ${session.sessionId}: ${session.date}`);
                    return; // Skip invalid dates
                }
                const month = dateObj.toLocaleString('default', { month: 'long' });
                if (!sessionsByMonth[month]) {
                    sessionsByMonth[month] = { total: 0, participated: 0 };
                }
                sessionsByMonth[month].total += 1;
            }
        });

        participatedSessions.forEach((session: Session) => {
            if (session.date) {
                const dateObj = new Date(session.date);
                if (isNaN(dateObj.getTime())) {
                    console.error(`Invalid date format for session ID ${session.sessionId}: ${session.date}`);
                    return; // Skip invalid dates
                }
                const month = dateObj.toLocaleString('default', { month: 'long' });
                if (sessionsByMonth[month]) {
                    sessionsByMonth[month].participated += 1;
                }
            }
        });

        console.log('Sessions by Month:', sessionsByMonth);

        // Step 4: Calculate attendance percentage per month
        const monthlyAttendance: MonthlyAttendance[] = Object.entries(sessionsByMonth).map(
            ([month, data]) => ({
                month,
                attendancePercentage: data.total > 0
                    ? parseFloat(((data.participated / data.total) * 100).toFixed(2))
                    : 0,
            })
        );

        // Optional: Sort the data chronologically
        const monthOrder = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December',
        ];

        monthlyAttendance.sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month));

        console.log('Monthly Attendance:', monthlyAttendance);

        // Respond with the calculated attendance data
        res.status(200).json(monthlyAttendance);
    } catch (error) {
        console.error('Error fetching attendance data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
