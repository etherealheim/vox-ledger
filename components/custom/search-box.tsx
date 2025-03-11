"use client";

import React, { useCallback, useState, useRef, useEffect, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";

// Mock data for testing
const mockPoliticians = [
  { name: "Petr Fiala", handle: "petr-fiala" },
  { name: "Andrej Babiš", handle: "andrej-babis" },
  { name: "Markéta Pekarová Adamová", handle: "marketa-pekarova-adamova" },
  { name: "Ivan Bartoš", handle: "ivan-bartos" },
  { name: "Tomio Okamura", handle: "tomio-okamura" },
  { name: "Vít Rakušan", handle: "vit-rakusan" },
  { name: "Marian Jurečka", handle: "marian-jurecka" },
  { name: "Jana Černochová", handle: "jana-cernochova" },
  { name: "Zbyněk Stanjura", handle: "zbynek-stanjura" },
  { name: "Miloš Zeman", handle: "milos-zeman" }
];

/**
 * Removes diacritics (accents) from a string
 * This improves search by making it accent-insensitive
 */
const removeDiacritics = (str: string): string => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

/**
 * Component that highlights matched text within a string
 * Supports diacritic-insensitive matching
 */
const HighlightMatch: React.FC<{ text: string; query: string }> = React.memo(({ text, query }) => {
    if (!query.trim()) {
        return <span>{text}</span>;
    }

    // Always return the original text with proper formatting if there's no good way to highlight
    const safeReturn = () => <span>{text}</span>;

    // Prepare text and query without diacritics for matching
    const normalizedText = text;
    const normalizedTextLower = removeDiacritics(text.toLowerCase());
    
    // For exact matching, use the full query first
    const fullQuery = query.toLowerCase().trim();
    const normalizedFullQuery = removeDiacritics(fullQuery);
    
    // Then split into terms for partial matching
    const queryTerms = fullQuery.split(/\s+/).filter(term => term.length > 0);
    
    if (queryTerms.length === 0) {
        return safeReturn();
    }

    // Create a map of positions to highlight
    const highlightPositions: {start: number; end: number}[] = [];
    
    // First try to match the full query (preserves spaces)
    if (normalizedFullQuery.length > 0) {
        let startPos = 0;
        while (startPos < normalizedTextLower.length) {
            const matchPos = normalizedTextLower.indexOf(normalizedFullQuery, startPos);
            if (matchPos === -1) break;
            
            highlightPositions.push({
                start: matchPos,
                end: matchPos + normalizedFullQuery.length
            });
            
            startPos = matchPos + 1;
        }
    }
    
    // If no full query matches or we want to highlight individual terms too
    if (highlightPositions.length === 0) {
        // Find positions for each query term
        queryTerms.forEach(term => {
            if (term.length === 0) return;
            
            const normalizedTerm = removeDiacritics(term);
            let startPos = 0;
            
            while (startPos < normalizedTextLower.length) {
                const matchPos = normalizedTextLower.indexOf(normalizedTerm, startPos);
                if (matchPos === -1) break;
                
                // Check if this match is at a word boundary or part of a word
                const isWordStart = matchPos === 0 || normalizedTextLower[matchPos - 1] === ' ';
                
                // Only add the match if it's at a word boundary
                if (isWordStart) {
                    highlightPositions.push({
                        start: matchPos,
                        end: matchPos + normalizedTerm.length
                    });
                }
                
                startPos = matchPos + 1; // Move just one character to find overlapping matches
            }
        });
    }
    
    // If we still don't have any positions to highlight, just return the text
    if (highlightPositions.length === 0) {
        return safeReturn();
    }
    
    // Sort positions and merge overlapping ranges
    highlightPositions.sort((a, b) => a.start - b.start);
    const mergedPositions: {start: number; end: number}[] = [];
    
    highlightPositions.forEach(pos => {
        if (mergedPositions.length === 0) {
            mergedPositions.push(pos);
            return;
        }
        
        const lastPos = mergedPositions[mergedPositions.length - 1];
        if (pos.start <= lastPos.end) {
            // Merge overlapping positions
            lastPos.end = Math.max(lastPos.end, pos.end);
        } else {
            mergedPositions.push(pos);
        }
    });
    
    // Build the highlighted text
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    
    mergedPositions.forEach((pos, index) => {
        // Add text before the highlight
        if (pos.start > lastIndex) {
            parts.push(
                <span key={`text-${lastIndex}`}>
                    {normalizedText.substring(lastIndex, pos.start)}
                </span>
            );
        }
        
        // Add the highlighted text
        parts.push(
            <span key={`match-${index}`} className="font-bold text-primary">
                {normalizedText.substring(pos.start, pos.end)}
            </span>
        );
        
        lastIndex = pos.end;
    });
    
    // Add any remaining text
    if (lastIndex < normalizedText.length) {
        parts.push(
            <span key={`text-${lastIndex}`}>
                {normalizedText.substring(lastIndex)}
            </span>
        );
    }
    
    return <>{parts}</>;
});

// Add display name for React.memo component
HighlightMatch.displayName = 'HighlightMatch';

interface SearchBoxProps {
    autoFocus?: boolean;
}

/**
 * SearchBox component that provides search functionality with suggestions
 * Features:
 * - Diacritic-insensitive search
 * - Top searched suggestions
 * - Keyboard navigation
 * - Search tracking
 */
const SearchBox: React.FC<SearchBoxProps> = ({ autoFocus = false }) => {
    const [query, setQuery] = useState<string>('');
    const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
    const [topSearched, setTopSearched] = useState<Array<{ name: string; handle: string }>>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const pathname = usePathname();
    const inputRef = useRef<HTMLInputElement>(null);
    
    // Auto-focus the input when the component mounts if autoFocus is true
    useEffect(() => {
        if (autoFocus && inputRef.current) {
            // Small delay to ensure the input is rendered
            const timeoutId = setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
            
            return () => clearTimeout(timeoutId);
        }
    }, [autoFocus, pathname]);

    // Fetch top searched politicians on mount
    useEffect(() => {
        const fetchTopSearched = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('/api/search');
                if (!response.ok) {
                    throw new Error('Failed to fetch top searched politicians');
                }
                const data = await response.json();
                if (data && Array.isArray(data)) {
                    // Use the first 5 politicians from the API if available
                    // Remove any duplicates by handle
                    const uniqueData = Array.from(
                        new Map(data.map(item => [item.handle, item])).values()
                    );
                    setTopSearched(uniqueData.slice(0, 5));
                } else {
                    // Fallback to mock data
                    setTopSearched(mockPoliticians.slice(0, 5));
                }
            } catch (err) {
                console.error('Error fetching top searched politicians:', err);
                // Fallback to mock data on error
                setTopSearched(mockPoliticians.slice(0, 5));
            } finally {
                setIsLoading(false);
            }
        };

        fetchTopSearched();
    }, []);

    // Track search in the database
    const trackSearch = useCallback(async (handle: string) => {
        try {
            const response = await fetch('/api/track-search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ handle }),
            });
            
            if (!response.ok) {
                console.error('Failed to track search');
            }
        } catch (err) {
            console.error('Error tracking search:', err);
        }
    }, []);

    // Filter suggestions based on query - with diacritic-insensitive search
    const filteredSuggestions = useMemo(() => {
        if (!query.trim()) return [];
        
        const searchTerms = query.toLowerCase().split(/\s+/).filter(term => term.length > 0);
        
        if (searchTerms.length === 0) return [];
        
        return mockPoliticians.filter((politician) => {
            // Check if all search terms are included in the politician's name or handle
            // Use diacritic-insensitive comparison
            const normalizedName = removeDiacritics(politician.name.toLowerCase());
            const normalizedHandle = removeDiacritics(politician.handle.toLowerCase());
            
            return searchTerms.every(term => {
                const normalizedTerm = removeDiacritics(term);
                return normalizedName.includes(normalizedTerm) || 
                       normalizedHandle.includes(normalizedTerm);
            });
        });
    }, [query]);

    // Get initial suggestions (for empty query)
    const initialSuggestions = useMemo(() => {
        // Ensure no duplicates in the initial suggestions
        const suggestions = topSearched.length > 0 ? topSearched : mockPoliticians.slice(0, 5);
        return Array.from(new Map(suggestions.map(item => [item.handle, item])).values());
    }, [topSearched]);

    // Find best match for navigation - with diacritic-insensitive search
    const findBestMatch = useCallback((searchQuery: string) => {
        const normalizedQuery = removeDiacritics(searchQuery.toLowerCase());
        
        // First try to find an exact match by name
        const exactMatch = mockPoliticians.find(
            politician => removeDiacritics(politician.name.toLowerCase()) === normalizedQuery
        );

        if (exactMatch) {
            return exactMatch;
        }

        // If no exact match, try to find a match by handle
        const handleMatch = mockPoliticians.find(
            politician => removeDiacritics(politician.handle.toLowerCase()) === normalizedQuery.replace(/\s+/g, '-')
        );

        if (handleMatch) {
            return handleMatch;
        }

        // If still no match, try to find a partial match
        const partialMatches = mockPoliticians.filter(politician => 
            removeDiacritics(politician.name.toLowerCase()).includes(normalizedQuery) ||
            removeDiacritics(politician.handle.toLowerCase()).includes(normalizedQuery.replace(/\s+/g, '-'))
        );

        if (partialMatches && partialMatches.length > 0) {
            return partialMatches[0];
        }

        return null;
    }, []);

    // Handle keyboard navigation
    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && query) {
            // If we have filtered suggestions, navigate to the first one
            if (filteredSuggestions.length > 0) {
                const politician = filteredSuggestions[0];
                trackSearch(politician.handle);
                router.push(`/character/${politician.handle}`);
            } else {
                // Try to find the best match
                const bestMatch = findBestMatch(query);
                if (bestMatch) {
                    trackSearch(bestMatch.handle);
                    router.push(`/character/${bestMatch.handle}`);
                } else {
                    // Last resort: format the query and navigate
                    const formattedQuery = query.trim().toLowerCase().replace(/\s+/g, '-');
                    router.push(`/character/${formattedQuery}`);
                }
            }
        }
    }, [query, filteredSuggestions, findBestMatch, router, trackSearch]);

    // Focus and blur handlers
    const handleFocus = useCallback(() => {
        setShowSuggestions(true);
    }, []);

    const handleBlur = useCallback(() => {
        // Increased delay to allow clicking on suggestions
        const timeoutId = setTimeout(() => {
            setShowSuggestions(false);
        }, 200);
        
        return () => clearTimeout(timeoutId);
    }, []);

    // Handle suggestion selection
    const handleSuggestionSelect = useCallback((handle: string) => {
        trackSearch(handle);
        router.push(`/character/${handle}`);
    }, [router, trackSearch]);

    return (
        <div className="p-4 relative">
            <Command className="rounded-lg border md:min-w-[450px] max-w-[450px] mx-auto overflow-hidden">
                <CommandInput
                    ref={inputRef}
                    placeholder={isLoading ? "Loading..." : "Type a name..."}
                    value={query}
                    onValueChange={setQuery}
                    onKeyDown={handleKeyDown}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    aria-label="Search politicians"
                />
                {showSuggestions && (
                    <CommandList>
                        {error ? (
                            <CommandEmpty>{error}</CommandEmpty>
                        ) : isLoading ? (
                            <CommandEmpty>Loading suggestions...</CommandEmpty>
                        ) : query === '' ? (
                            <CommandGroup heading="Top Searched Politicians">
                                {initialSuggestions.map((politician) => (
                                    <CommandItem
                                        key={politician.handle}
                                        className="cursor-pointer"
                                        onSelect={() => handleSuggestionSelect(politician.handle)}
                                        value={politician.name}
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
                                        onSelect={() => handleSuggestionSelect(politician.handle)}
                                        value={politician.name}
                                    >
                                        <HighlightMatch text={politician.name} query={query} />
                                        <span className="text-muted-foreground text-xs ml-2">
                                            ({politician.handle})
                                        </span>
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

// Export with memo to prevent unnecessary re-renders
export default React.memo(SearchBox);
