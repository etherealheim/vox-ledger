"use client";

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import useSWR from 'swr'; // Wikipedia

import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartPie } from '@/components/custom/chart-pie';
import { ChartArea } from '@/components/custom/chart-area';

const CharacterPage = () => {
    // Generate Person's Name from the pathname
    const pathname = usePathname();
    const character =
        pathname
            ?.split('/')
            .pop()
            ?.split('-')
            .map((word) =>
                word.length === 1
                    ? word.toUpperCase() + '.'
                    : word.charAt(0).toUpperCase() + word.slice(1)
            )
            .join(' ') || '';

    // State variables for OpenAI responses
    const [position, setPosition] = useState<string | null>(null);
    const [positionError, setPositionError] = useState<string | null>(null);

    // Fetch Wikipedia description
    const fetcher = (url: string) => fetch(url).then((res) => res.json());
    const { data, error } = useSWR(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${character}`,
        fetcher
    );

    // Reusable function to fetch OpenAI completions
    const fetchCompletion = async (prompt: string) => {
        try {
            const res = await fetch('/api/openai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt }),
            });
            const data = await res.json();
            if (res.ok) {
                return data.text;
            } else {
                console.error('Error fetching completion:', data.error);
                return null;
            }
        } catch (error) {
            console.error('Error fetching completion:', error);
            return null;
        }
    };

    // Fetch position using OpenAI
    useEffect(() => {
        if (character) {
            const prompt = `What is/was the position of ${character}? for example "Former Member of Parliament" Dont mention name. Format text with camel case letters. Use space between words double check the response`;

            fetchCompletion(prompt)
                .then(setPosition)
                .catch(() => setPositionError('Error fetching position'));
        }
    }, [character]);

    // Handle errors and loading states
    if (positionError) return <div>{positionError}</div>;
    if (error) return <div>Failed to load</div>;
    if (!data) return <div></div>;

    const description = data.extract || '';

    return (
        <div>
            <section className="container mx-auto grid grid-cols-12 pt-24">
                <div className="col-span-6">
                    <h1 className="text-5xl font-bold font-[family-name:var(--font-syne-sans)] text-stone-200 pb-2">
                        {character}
                    </h1>
                    {position ? (
                        <p className="font-[family-name:var(--font-satoshi-sans)] text-stone-500 text-xl font-semibold pb-8">
                            {position}
                        </p>
                    ) : (
                        <div className='pt-2 pb-8'><Skeleton className="w-[300px] h-[20px] rounded-xl" /></div>

                    )}
                    <p className="font-[family-name:var(--font-satoshi-sans)] text-stone-300 text-lg font-medium">
                        {description}
                    </p>
                </div>
            </section>
            <section className="container mx-auto grid grid-cols-12 pt-24 gap-10">
                <div className='col-span-8'>
                    <h2 className='text-3xl font-bold font-[family-name:var(--font-syne-sans)] text-stone-200 pb-6'>Recent Claims</h2>

                </div>
                <div className='col-span-4'>
                    <h2 className='text-3xl font-bold font-[family-name:var(--font-syne-sans)] text-stone-200 pb-6'>Voting</h2>
                    <Tabs defaultValue="chart">
                        <TabsList>
                            <TabsTrigger value="chart">Chart</TabsTrigger>
                            <TabsTrigger value="vote-log">Vote Log</TabsTrigger>
                        </TabsList>
                        <TabsContent value="chart">
                            <ChartPie />
                        </TabsContent>
                        <TabsContent value="vote-log">Change your password here.</TabsContent>
                    </Tabs>
                    <h2 className='text-3xl font-bold font-[family-name:var(--font-syne-sans)] text-stone-200 pb-6 pt-24'>Attendance</h2>
                    <Tabs defaultValue="chart">
                        <TabsList>
                            <TabsTrigger value="chart">Chart</TabsTrigger>
                            <TabsTrigger value="vote-log">Vote Log</TabsTrigger>
                        </TabsList>
                        <TabsContent value="chart">
                            <ChartArea />
                        </TabsContent>
                        <TabsContent value="vote-log">Change your password here.</TabsContent>
                    </Tabs>
                </div>
            </section>
        </div>
    );
};

export default CharacterPage;
