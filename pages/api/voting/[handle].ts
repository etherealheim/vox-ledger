import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/src/db';
import { politicians, votes, votingSessions } from '@/src/db/schema';
import { eq } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { handle } = req.query;

    try {
        // Fetch all votes (yes, no, abstain, etc.) for a specific politician
        const results = await db
            .select({
                sessionId: votingSessions.sessionId,
                date: votingSessions.date,
                time: votingSessions.time,
                title: votingSessions.title,
                meetingDetails: votingSessions.meetingDetails,
                votes: {
                    politicianName: politicians.name,
                    vote: votes.vote,
                },
            })
            .from(votingSessions)
            .leftJoin(votes, eq(votes.votingSessionId, votingSessions.id))
            .leftJoin(politicians, eq(votes.politicianId, politicians.id))
            .where(eq(politicians.handle, handle as string));

        res.status(200).json(results);
    } catch (error) {
        console.error('Error fetching voting data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
