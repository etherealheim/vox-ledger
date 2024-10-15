"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Ensure this matches your Next.js setup
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";

interface Politician {
    name: string;
    handle: string;
}

const SearchBox: React.FC = () => {
    const [query, setQuery] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestions, setSuggestions] = useState<Politician[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchPoliticians = async () => {
            try {
                const response = await fetch('/api/search');
                const data = await response.json();
                setSuggestions(data);
            } catch (error) {
                console.error('Error fetching politicians:', error);
            }
        };

        fetchPoliticians();
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && query) {
            const formattedQuery = query.trim().toLowerCase().replace(/\s+/g, '-');
            router.push(`/character/${formattedQuery}`);
        }
    };

    const handleFocus = () => {
        setShowSuggestions(true);
    };

    const handleBlur = () => {
        // Delay hiding suggestions to allow onSelect to fire
        setTimeout(() => {
            setShowSuggestions(false);
        }, 100); // Adjust delay as needed
    };

    const filteredSuggestions = suggestions.filter((politician) =>
        politician.name.toLowerCase().includes(query.toLowerCase())
    );

    const initialSuggestions = suggestions.slice(0, 5);

    return (
        <div className="p-4 relative">
            <Command className="rounded-lg border md:min-w-[450px] max-w-[450px] mx-auto overflow-hidden">
                <CommandInput
                    placeholder="Type a name..."
                    value={query}
                    onValueChange={setQuery}
                    onKeyDown={handleKeyDown}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                />
                {showSuggestions && (
                    <CommandList>
                        {query === '' ? (
                            <CommandGroup heading="Suggestions">
                                {initialSuggestions.map((politician) => (
                                    <CommandItem
                                        key={politician.handle}
                                        className="cursor-pointer"
                                        onMouseDown={() => router.push(`/character/${politician.handle}`)}
                                    >
                                        {politician.name}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        ) : filteredSuggestions.length === 0 ? (
                            <CommandEmpty>No results found.</CommandEmpty>
                        ) : (
                            <CommandGroup heading="Suggestions">
                                {filteredSuggestions.map((politician) => (
                                    <CommandItem
                                        key={politician.handle}
                                        className="cursor-pointer"
                                        onMouseDown={() => router.push(`/character/${politician.handle}`)}
                                    >
                                        {politician.name}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        )}
                    </CommandList>
                )}
            </Command>
        </div>
    );
};

export default SearchBox;
