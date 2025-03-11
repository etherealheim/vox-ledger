"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ChartPie } from '@/components/custom/chart-pie';
import { ChartArea } from '@/components/custom/chart-area';
import CardSummary from '@/components/custom/card-summary';
import Timeline from '@/components/custom/timeline';
import { AccordionVote } from '@/components/custom/accordion-vote';

// Mapping of handles to proper names with diacritics
const handleToNameMap: Record<string, string> = {
  'petr-fiala': 'Petr Fiala',
  'andrej-babis': 'Andrej Babiš',
  'marketa-pekarova-adamova': 'Markéta Pekarová Adamová',
  'ivan-bartos': 'Ivan Bartoš',
  'tomio-okamura': 'Tomio Okamura',
  'vit-rakusan': 'Vít Rakušan',
  'marian-jurecka': 'Marian Jurečka',
  'jana-cernochova': 'Jana Černochová',
  'zbynek-stanjura': 'Zbyněk Stanjura',
  'milos-zeman': 'Miloš Zeman'
};

// Mapping of handles to positions (replacing OpenAI functionality)
const handleToPositionMap: Record<string, string> = {
  'petr-fiala': 'Prime Minister of the Czech Republic',
  'andrej-babis': 'Former Prime Minister, Leader of ANO Party',
  'marketa-pekarova-adamova': 'Speaker of the Chamber of Deputies',
  'ivan-bartos': 'Deputy Prime Minister',
  'tomio-okamura': 'Leader of Freedom and Direct Democracy Party',
  'vit-rakusan': 'Minister of the Interior',
  'marian-jurecka': 'Minister of Labor and Social Affairs',
  'jana-cernochova': 'Minister of Defense',
  'zbynek-stanjura': 'Minister of Finance',
  'milos-zeman': 'Former President of the Czech Republic'
};

const CharacterPage = () => {
    const params = useParams();
    const handle = params?.handle as string | undefined;

    // Get character name from mapping or generate from handle
    const character = handle ? (
        handleToNameMap[handle] || 
        handle
            .split('-')
            .map((word) =>
                word.length === 1
                    ? word.toUpperCase() + '.'
                    : word.charAt(0).toUpperCase() + word.slice(1)
            )
            .join(' ')
    ) : '';

    // Get position from mapping or use a default
    const position = handle ? handleToPositionMap[handle] || 'Czech Politician' : '';

    // Fetch Wikipedia description
    const fetcher = (url: string) => fetch(url).then((res) => res.json());
    const { data, error } = useSWR(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(character)}`,
        fetcher
    );

    // Handle errors and loading states
    if (error) return <div className="text-red-500">Failed to load Wikipedia data.</div>;
    if (!data) return <div className="text-gray-500"></div>;

    const description = data.extract || '';

    return (
        <div>
            {/* Character Information Section */}
            <section className="container mx-auto grid grid-cols-12 pt-24 gap-10">
                <div className="col-span-6">
                    <h1 className="text-5xl font-bold font-[family-name:var(--font-syne-sans)] text-stone-200 pb-2">
                        {character}
                    </h1>
                    <p className="font-[family-name:var(--font-satoshi-sans)] text-stone-500 text-xl font-semibold pb-8">
                        {position}
                    </p>
                    <p className="font-[family-name:var(--font-satoshi-sans)] text-stone-300 text-lg font-medium">
                        {description}
                    </p>
                </div>
                <div className='col-span-6 flex flex-col items-end space-y-4'>

                </div>
            </section>

            {/* Recent Claims and Voting Sections */}
            <section className="container mx-auto grid grid-cols-12 pt-24 gap-10 pb-24">
                {/* Recent Claims */}
                <div className='col-span-8'>
                    <div>
                        <h2 className='text-3xl font-bold font-[family-name:var(--font-syne-sans)] text-stone-200 pb-6'>Recent Claims</h2>
                        <Tabs defaultValue="twitter">
                            <TabsList>
                                <TabsTrigger value="twitter">Twitter</TabsTrigger>
                                <TabsTrigger value="public-press">Public Press</TabsTrigger>
                                <TabsTrigger value="other">Other</TabsTrigger>
                            </TabsList>
                            <TabsContent value="twitter">
                                <CardSummary />
                            </TabsContent>
                            <TabsContent value="public-press">
                                <CardSummary />
                            </TabsContent>
                            <TabsContent value="other">
                                <CardSummary />
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>

                {/* Voting and Attendance */}
                <div className='col-span-4'>
                    <h2 className='text-3xl font-bold font-[family-name:var(--font-syne-sans)] text-stone-200 pb-6'>Voting</h2>
                    <Tabs defaultValue="chart">
                        <TabsList>
                            <TabsTrigger value="chart">Chart</TabsTrigger>
                            <TabsTrigger value="vote-log">Vote Log</TabsTrigger>
                        </TabsList>
                        <TabsContent value="chart">
                            {handle ? (
                                <ChartPie handle={handle} />
                            ) : (
                                <div className="text-gray-500">Loading chart...</div>
                            )}
                        </TabsContent>
                        <TabsContent value="vote-log">
                            <AccordionVote />
                        </TabsContent>
                    </Tabs>
                    <h2 className='text-3xl font-bold font-[family-name:var(--font-syne-sans)] text-stone-200 pb-6 pt-12'>Attendance</h2>
                    {handle ? (
                        <ChartArea handle={handle} />
                    ) : (
                        <div className="text-gray-500">Loading attendance chart...</div>
                    )}
                    <Timeline />
                </div>
            </section>
        </div>
    );
};

export default CharacterPage;
