"use client"

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchResult {
    title: string;
    url: string;
    snippet: string;
}

const SearchBox: React.FC = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);

    const handleSearch = async () => {
        if (!query) return;

        try {
            const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
            const data = await response.json();
            setResults(data.results);
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    };

    return (
        <div className="p-4">
            <div className="flex mx-auto space-x-4 w-full max-w-2xl items-center">
                <Input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-grow"
                    placeholder="Search"
                />
                <Button onClick={handleSearch} variant="outline">
                    Search
                </Button>
            </div>
            <div className="mt-4">
                {results.map((result, index) => (
                    <div key={index} className="mb-2">
                        <a href={result.url} className="text-blue-600">{result.title}</a>
                        <p>{result.snippet}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SearchBox;