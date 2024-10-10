import React from 'react';
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from '../ui/separator';
import { TextEffect } from './text-effect';
import CustomTags from "@/components/custom/custom-tags"
import { ArrowUpRightIcon } from '@heroicons/react/16/solid';
import Link from 'next/link';

const DATE = "24-04-2024";
const LINK = "#";
const SUMMARY = "Communication contains a mixture of reasonable arguments, populism, and generalized assertions without deeper analysis. The arguments are framed in a way to blame both sides (left and right) for a lack of discourse, which is a recognizable pattern in political rhetoric. Additionally, there is some oversimplification and emotional appeal to class struggles.";
const PARAGRAPHS = [
    "Problémem stávajících stran, ať už si říkají levicové či pravicové je, že se bojí otevřené a pravdivé diskuze o tom, jaký stát si přejeme a jak nastavíme jeho veřejné služby tak, aby byly ufinancovatelné. Takže je máme dlouhodobě neufinancovatelné, na což doplatíme všichni…",
    "Což o to, vrcholní představitelé mají být dobře placeni. Vzhledem k počtu osob je to rozpočtově bezvýznamné. Hádky o platy politiků jsou vždy přehlídkou populismu.To všechno je pravda. Přesto si myslím, že dnes je na to hodně nesprávná chvíle.",
    "Nepříjemné je, že kdykoliv se @SOCDEM_cz pokoušela být moderní nekomunistickou levicí, oslabovala(Horák, Battěk, Špidla). Posilovala tehdy, když oslovila bolševickou mentalitu a probudila třídní nenávist(Zeman, Paroubek). Takže kudy, přátelé či soudruzi?",
    "Tyhle řeči jsou strašně nebezpečné. Řítíme se do už brzké demografické krize, až silné ročníky po r.2030 začnou odcházet do důchodu, přestanou platit a začnou čerpat. Ani ty navržené úpravy ten problém plně neřeší, jenom ho mírní. Politici, kteří to lidem zamlčují, nebo tvrdí, že to dokáží vyřešit “lepším výběrem daní”, je úmyslně uvádějí v omyl stejně tak, jako by nemocnému lékař tvrdil, že se nemusí léčit. Ohrožují tak jejich vlastní budoucnost a žadají jejich hlasy za to, že je poškodí."
];

const CardSummary: React.FC = () => {
    return (
        <>
            <Card>
                <CardContent>

                    <Tabs defaultValue="week" className="pt-6 pb-6">
                        <div className="flex justify-between items-center">
                            <div className="flex-1 space-y-2">
                                <CardTitle className="mb-2">Summary</CardTitle>
                                <TabsContent value="week">
                                    <CardDescription>Weekly</CardDescription>
                                </TabsContent>
                                <TabsContent value="month">
                                    <CardDescription>Monthly</CardDescription>
                                </TabsContent>
                                <TabsContent value="year">
                                    <CardDescription>Yearly</CardDescription>
                                </TabsContent>
                                <TabsContent value="all">
                                    <CardDescription>All Time</CardDescription>
                                </TabsContent>
                            </div>
                            <TabsList className='flex justify-end'>
                                <TabsTrigger value="week">
                                    <span className='pr-2'>Past Week</span>
                                    <Badge>23</Badge>
                                </TabsTrigger>
                                <TabsTrigger value="month">
                                    <span className='pr-2'>Past Month</span>
                                    <Badge variant="secondary">124</Badge>
                                </TabsTrigger>
                                <TabsTrigger value="year">
                                    <span className='pr-2'>Past Year</span>
                                    <Badge variant="secondary">385</Badge>
                                </TabsTrigger>
                                <TabsTrigger value="all">
                                    <span className='pr-2'>All</span>
                                    <Badge variant="secondary">923</Badge>
                                </TabsTrigger>
                            </TabsList>
                        </div>
                        <TabsContent value="week" className='font-[family-name:var(--font-satoshi-sans)] text-stone-300 text-md font-medium'>
                            <p className='font-[family-name:var(--font-satoshi-sans)] text-stone-400 text-lg font-medium pt-3'>
                                <TextEffect per='word' preset='fade'>{SUMMARY}</TextEffect>
                            </p>
                            <CustomTags tags={["Reasonable arguments", "Populism", "Framing", "Oversimplification"]} />
                            <Separator />
                            {PARAGRAPHS.map((paragraph, index) => (
                                <div key={index}>
                                    <div className='flex items-center pt-4'>
                                        <p className='font-[family-name:var(--font-geist-mono)] text-stone-600 text-sm font-bold pt-2 pb-2'>{DATE}</p>
                                        <Link href={LINK} className="pl-2">
                                            <ArrowUpRightIcon className="h-4 w-4 text-stone-300" />
                                        </Link>
                                    </div>
                                    <p>
                                        {paragraph}
                                    </p>
                                </div>
                            ))}
                            <div className="pt-4">
                                <Button variant="secondary">More</Button>
                            </div>
                        </TabsContent>

                        <TabsContent value="month">Month</TabsContent>
                        <TabsContent value="year">Year</TabsContent>
                        <TabsContent value="all">All</TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </>
    );
};

export default CardSummary;