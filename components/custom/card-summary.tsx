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
const PARAGRAPHS = [
    "Problémem stávajících stran, ať už si říkají levicové či pravicové je, že se bojí otevřené a pravdivé diskuze o tom, jaký stát si přejeme a jak nastavíme jeho veřejné služby tak, aby byly ufinancovatelné. Takže je máme dlouhodobě neufinancovatelné, na což doplatíme všichni…",
    "Což o to, vrcholní představitelé mají být dobře placeni. Vzhledem k počtu osob je to rozpočtově bezvýznamné. Hádky o platy politiků jsou vždy přehlídkou populismu.To všechno je pravda. Přesto si myslím, že dnes je na to hodně nesprávná chvíle.",
    "Nepříjemné je, že kdykoliv se @SOCDEM_cz pokoušela být moderní nekomunistickou levicí, oslabovala(Horák, Battěk, Špidla). Posilovala tehdy, když oslovila bolševickou mentalitu a probudila třídní nenávist(Zeman, Paroubek). Takže kudy, přátelé či soudruzi?",
    "Tyhle řeči jsou strašně nebezpečné. Řítíme se do už brzké demografické krize, až silné ročníky po r.2030 začnou odcházet do důchodu, přestanou platit a začnou čerpat. Ani ty navržené úpravy ten problém plně neřeší, jenom ho mírní. Politici, kteří to lidem zamlčují, nebo tvrdí, že to dokáží vyřešit “lepším výběrem daní”, je úmyslně uvádějí v omyl stejně tak, jako by nemocnému lékař tvrdil, že se nemusí léčit. Ohrožují tak jejich vlastní budoucnost a žadají jejich hlasy za to, že je poškodí.",
    "Měl jsem dva premiéry z @ODScz.Byli odlišní a vztahy jsme měli různé.Ale stoprocentně vím, že kdybych jim přinesl v rozpočtu “cinknutá” čísla, tak mě s tím oba vyrazili ze dveří a nařídili přepracovat.ODS měla v genech, že rozpočet musí být pravdivý a poctivý.Je velkým politickým zklamáním, že už to v genech nemá.",
    "Paní poslankyně @alenaschillerová, já bych akceptoval váš odpor proti navrženým změnám, kdybyste předkládali srozumitelnou alternativu; je to ale stejné, jako v r.2014: zrušili jste Nečasovu reformu a @AndrejBabis slíbil, že záhy předloží jinou, lepší; nepředložili jste nic, jenom jste každoročně zhoršovali bilanci stávajícího systému mnohem větší, než zákonnou valorizací; křičet “ne!”, ale nemít řešení není program; letět do zdi a tvrdit, že tam ta zeď není, je hazard s budoucností nás všech; děláte bohužel obojí.",
    "Je možné diskutovat o výši deficitu. Je možné leccos omlouvat koaličními kompromisy. Není ale možné vědomě napsat do rozpočtu nepravdivá čísla. To nesmíte, ať už jste pravičák nebo levičák. To nelze omluvit ničím.",
    "O “cynismu vůči obětem povodní” nemůže být řeč. Nelžete a neberte si je jako rukojmí, @juchelkaa . Ti se k finanční pomoci dostanou. Skutečnost je taková, že peníze, které už máme schválené z fondu soudržnosti na různé projekty, můžeme přesunout na škody po povodních. Je to férové a dobré řešení. Prostě si něco méně důležitého odpustíme a pomůžeme obětem povodní. Škoda jen, že to takhle nebylo prezentováno hned a že jsme to všichni pochopili tak, že to budou “peníze navíc”. Navíc nedostaneme nic. Ale můžeme si změnit priority, na co ty peníze použijeme. Škoda, že takhle nepostupuje i Vláda ČR v našem národním rozpočtu a místo změny priorit volí větší zadlužení. V historii je to poprvé. Při předchozích povodních žádná vláda deficit nezvyšovala. Ani ta jednobarevně socialistická v r.2002. Ale tenkrát byly rozpočtově odpovědné i socialistické vlády.",
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
                                <TextEffect per='word' preset='fade'>The texts are rich with rhetorical techniques designed to persuade an audience through
                                    a mixture of <span className="text-white underline decoration-dotted">emotional appeal</span>, <span className="text-white underline decoration-dotted">selective presentation</span>, and <span className="text-white underline decoration-dotted">criticism</span> of political opponents. While they are not overtly
                                    deceitful, there is a manipulative undertone in the way issues are framed (e.g., <span className="text-white underline decoration-dotted">false dilemmas</span>, <span className="text-white underline decoration-dotted">scapegoating</span>) and in the
                                    selective emphasis on certain aspects of reality. The analysis suggests moderate levels of exaggeration, primarily
                                    through <span className="text-white underline decoration-dotted">oversimplification</span> and <span className="text-white underline decoration-dotted">emotional scaremongering</span>.
                                    While these techniques may resonate with an audience that already shares the author&apos;s views, they could alienate those
                                    seeking more balanced, nuanced debate. The language is assertive, making use of &quot;we&quot; versus &quot;they&quot; dynamics, invoking past
                                    experiences and positioning the speaker as a voice of reason amid a sea of populism and irresponsibility.</TextEffect>
                            </p>
                            <CustomTags tags={["Rhetorical Techniques", "Emotional Appeal", "Selective Presentation", "False Dilemmas", "Scapegoating", "Oversimplification"]} />
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
            </Card >
        </>
    );
};

export default CardSummary;