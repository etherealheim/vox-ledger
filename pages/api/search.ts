import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/src/db';
import { politicians, searchStats } from '@/src/db/schema';
import { ilike, desc, sql, eq } from 'drizzle-orm';

// Cache for politicians data (5 minute TTL)
let politiciansCache: { data: any; timestamp: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const query = req.query.q as string;
        
        // Check if we have a valid cache
        const now = Date.now();
        if (politiciansCache && (now - politiciansCache.timestamp < CACHE_TTL)) {
            // If there's a query, filter the cached data
            if (query) {
                const filteredData = politiciansCache.data.filter((politician: any) => {
                    return politician.name.toLowerCase().includes(query.toLowerCase()) ||
                           politician.handle.toLowerCase().includes(query.toLowerCase());
                });
                return res.status(200).json(filteredData);
            }
            
            // Otherwise, return all cached data
            return res.status(200).json(politiciansCache.data);
        }
        
        // If no cache or cache expired, fetch from database
        let politiciansData;
        
        if (query) {
            // If there's a query, search for matching politicians
            politiciansData = await db
                .select({
                    id: politicians.id,
                    name: politicians.name,
                    handle: politicians.handle
                })
                .from(politicians)
                .where(
                    sql`${politicians.name} ILIKE ${`%${query}%`} OR ${politicians.handle} ILIKE ${`%${query}%`}`
                )
                .limit(10);
        } else {
            // Try to get top searched politicians first
            try {
                const topSearched = await db
                    .select({
                        id: politicians.id,
                        name: politicians.name,
                        handle: politicians.handle,
                        searchCount: searchStats.searchCount
                    })
                    .from(searchStats)
                    .innerJoin(politicians, eq(searchStats.politicianId, politicians.id))
                    .orderBy(desc(searchStats.searchCount))
                    .limit(10);
                
                if (topSearched && topSearched.length > 0) {
                    // Update cache and return top searched
                    politiciansCache = {
                        data: topSearched,
                        timestamp: now
                    };
                    return res.status(200).json(topSearched);
                }
            } catch (error) {
                console.error('Error fetching top searched politicians:', error);
                // Continue to fallback if there's an error
            }
            
            // Fallback: get all politicians if no top searched or if there was an error
            politiciansData = await db
                .select({
                    id: politicians.id,
                    name: politicians.name,
                    handle: politicians.handle
                })
                .from(politicians)
                .limit(10);
        }
        
        // Update cache with new data
        politiciansCache = {
            data: politiciansData,
            timestamp: now
        };
        
        return res.status(200).json(politiciansData);
    } catch (error) {
        console.error('Error in search API:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
