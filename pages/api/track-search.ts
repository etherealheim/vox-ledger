import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/src/db';
import { politicians, searchStats } from '@/src/db/schema';
import { eq, sql } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { politicianId, handle } = req.body;

        if (!politicianId && !handle) {
            return res.status(400).json({ error: 'Either politicianId or handle is required' });
        }

        let targetPoliticianId = politicianId;

        // If handle is provided but not politicianId, look up the politician by handle
        if (!targetPoliticianId && handle) {
            const politician = await db
                .select({ id: politicians.id })
                .from(politicians)
                .where(eq(politicians.handle, handle))
                .limit(1);

            if (politician.length === 0) {
                return res.status(404).json({ error: 'Politician not found' });
            }

            targetPoliticianId = politician[0].id;
        }

        // Check if the politician already has a search stats record
        const existingStats = await db
            .select()
            .from(searchStats)
            .where(eq(searchStats.politicianId, targetPoliticianId));

        if (existingStats.length > 0) {
            // Update existing record
            await db
                .update(searchStats)
                .set({
                    searchCount: sql`${searchStats.searchCount} + 1`,
                    lastSearched: new Date()
                })
                .where(eq(searchStats.politicianId, targetPoliticianId));
        } else {
            // Create new record
            await db
                .insert(searchStats)
                .values({
                    politicianId: targetPoliticianId,
                    searchCount: 1,
                    lastSearched: new Date()
                });
        }

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error tracking search:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
} 