import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ error: 'Query is required' });
    }

    try {
        console.log(`Query received: ${query}`);

        const response = await fetch(`https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query as string)}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Accept-Encoding': 'gzip',
                'X-Subscription-Token': process.env.BRAVE_API_KEY || '<YOUR_API_KEY>',
            },
        });

        const data = await response.json();
        console.log('Brave API data:', data);

        // Extract 'web' results
        if (data.web && data.web.results) {
            const webResults = data.web.results.map((result: any) => ({
                title: result.title || 'No title',
                url: result.url,
                snippet: result.snippet || 'No snippet',
            }));
            res.status(200).json({ results: webResults });
        } else {
            res.status(404).json({ error: 'No web search results found' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to fetch search results' });
    }
};

export default handler;
