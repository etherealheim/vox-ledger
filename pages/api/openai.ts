import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { prompt } = req.body;

    // Validate the prompt
    if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ error: 'Prompt is required and must be a string' });
    }

    // Sanitize and limit the prompt length
    const sanitizedPrompt = prompt.trim();
    if (sanitizedPrompt.length > 1000) {
        return res.status(400).json({ error: 'Prompt is too long (max 1000 characters)' });
    }

    try {
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        // Use the Chat Completion API with gpt-3.5-turbo
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo', // Use 'gpt-4' if you have access
            messages: [{ role: 'user', content: sanitizedPrompt }],
            max_tokens: 150, // Adjust as needed
            temperature: 0.7, // Adjust as needed
        });

        const text = response.choices[0]?.message?.content?.trim() ?? 'No content available';

        res.status(200).json({ text });
    } catch (error) {
        console.error('Error fetching OpenAI completion:', error);
        res.status(500).json({ error: 'Error fetching OpenAI completion', details: error instanceof Error ? error.message : 'Unknown error' });
        res.status(500).json({ error: 'Error fetching OpenAI completion' });
    }
}
