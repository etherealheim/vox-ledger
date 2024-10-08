"use client"

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const SearchBox: React.FC = () => {
    const [query, setQuery] = useState('');
    const router = useRouter();

    const handleSearch = () => {
        if (!query) return;

        const formattedQuery = query.trim().toLowerCase().replace(/\s+/g, '-');
        router.push(`/character/${formattedQuery}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="p-4">
            <div className="flex mx-auto space-x-4 w-full max-w-2xl items-center">
                <Input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-grow"
                    placeholder="Search without diacriticis"
                />
                <Button onClick={handleSearch} variant="outline">
                    Search
                </Button>
            </div>
        </div>
    );
};

export default SearchBox;