import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/src/db';
import { politicians } from '@/src/db/schema';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Fetch all politicians' names and handles
        const allPoliticians = await db
            .select({
                name: politicians.name,
                handle: politicians.handle,
            })
            .from(politicians);

        // Respond with the list of politicians' names and handles
        res.status(200).json(allPoliticians);
    } catch (error) {
        console.error('Error fetching politicians data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
