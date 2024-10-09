"use client";

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import useSWR from 'swr'; // Wikipedia

import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartPie } from '@/components/custom/chart-pie';
import { ChartArea } from '@/components/custom/chart-area';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { Separator } from '@/components/ui/separator';
import { Badge } from "@/components/ui/badge"



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
                    <div className='flex gap-2 pt-6'>
                        <Badge variant="outline">Reasonable arguments</Badge>
                        <Badge variant="outline">Populism</Badge>
                        <Badge variant="outline">Framing</Badge>
                        <Badge variant="outline">Oversimplification</Badge>
                    </div>
                </div>
            </section>
            <section className="container mx-auto grid grid-cols-12 pt-24 gap-10 pb-24">
                <div className='col-span-8'>
                    <div>
                        <h2 className='text-3xl font-bold font-[family-name:var(--font-syne-sans)] text-stone-200 pb-6'>Recent Claims</h2>
                        <Tabs defaultValue="chart">
                            <TabsList>
                                <TabsTrigger value="chart">Twitter</TabsTrigger>
                                <TabsTrigger value="vote-log">Public Press</TabsTrigger>
                                <TabsTrigger value="vote-log">Other</TabsTrigger>
                            </TabsList>
                            <TabsContent value="chart">
                            </TabsContent>
                            <TabsContent value="vote-log">Change your password here.</TabsContent>
                        </Tabs>
                        <Card>
                            <CardHeader>
                                <CardTitle>Summary</CardTitle>
                                <CardDescription>Weekly</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className='font-[family-name:var(--font-satoshi-sans)] text-stone-400 text-lg font-medium'>Communication contains a mixture of reasonable arguments, populism, and generalized assertions without deeper analysis. The arguments are framed in a way to blame both sides (left and right) for a lack of discourse, which is a recognizable pattern in political rhetoric. Additionally, there is some oversimplification and emotional appeal to class struggles.</p>
                            </CardContent>
                        </Card>

                        <Card className='mt-6'>
                            <CardContent>
                                <Tabs defaultValue="week" className='pt-6 pb-6'>
                                    <TabsList>
                                        <TabsTrigger value="week">
                                            <span className='pr-2'>Past Week</span>
                                            <Badge>23</Badge>
                                        </TabsTrigger>
                                        <TabsTrigger value="month">
                                            <span className='pr-2'>Past Month</span>
                                            <Badge variant="secondary">124</Badge>
                                        </TabsTrigger>
                                        <TabsTrigger value="year"><span className='pr-2'>Past Year</span>
                                            <Badge variant="secondary">385</Badge></TabsTrigger>
                                        <TabsTrigger value="all"><span className='pr-2'>All</span>
                                            <Badge variant="secondary">923</Badge></TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="week" className='font-[family-name:var(--font-satoshi-sans)] text-stone-300 text-md font-medium'>
                                        <p className='font-[family-name:var(--font-geist-mono)] text-stone-600 text-sm font-bold pt-2 pb-2'>24-04-2024</p>
                                        <p className='pb-6'>Problémem stávajících stran, ať už si říkají levicové či pravicové je, že se bojí otevřené a pravdivé diskuze o tom, jaký stát si přejeme a jak nastavíme jeho veřejné služby tak, aby byly ufinancovatelné. Takže je máme dlouhodobě neufinancovatelné, na což doplatíme všichni…</p>
                                        <p className='font-[family-name:var(--font-geist-mono)] text-stone-600 text-sm font-bold pt-2 pb-2'>24-04-2024</p>
                                        <p className='pb-6'>Což o to, vrcholní představitelé mají být dobře placeni. Vzhledem k počtu osob je to rozpočtově bezvýznamné. Hádky o platy politiků jsou vždy přehlídkou populismu.To všechno je pravda. Přesto si myslím, že dnes je na to hodně nesprávná chvíle.</p>
                                        <p className='font-[family-name:var(--font-geist-mono)] text-stone-600 text-sm font-bold pt-2 pb-2'>24-04-2024</p>
                                        <p className='pb-6'>Nepříjemné je, že kdykoliv se @SOCDEM_cz pokoušela být moderní nekomunistickou levicí, oslabovala(Horák, Battěk, Špidla). Posilovala tehdy, když oslovila bolševickou mentalitu a probudila třídní nenávist(Zeman, Paroubek). Takže kudy, přátelé či soudruzi?</p>
                                        <p className='font-[family-name:var(--font-geist-mono)] text-stone-600 text-sm font-bold pt-2 pb-2'>24-04-2024</p>
                                        <p className='pb-6'>Tyhle řeči jsou strašně nebezpečné. Řítíme se do už brzké demografické krize, až silné ročníky po r.2030 začnou odcházet do důchodu, přestanou platit a začnou čerpat. Ani ty navržené úpravy ten problém plně neřeší, jenom ho mírní. Politici, kteří to lidem zamlčují, nebo tvrdí, že to dokáží vyřešit “lepším výběrem daní”, je úmyslně uvádějí v omyl stejně tak, jako by nemocnému lékař tvrdil, že se nemusí léčit. Ohrožují tak jejich vlastní budoucnost a žadají jejich hlasy za to, že je poškodí.</p>
                                        <Button variant="outline"> More</Button>
                                    </TabsContent>
                                    <TabsContent value="month">Month</TabsContent>
                                    <TabsContent value="year">Year</TabsContent>
                                    <TabsContent value="all">All</TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>

                    </div>
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
            </section >
        </div >
    );
};

export default CharacterPage;
