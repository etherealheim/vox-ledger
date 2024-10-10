import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from '@/components/custom/accordion';
import { CheckCircleIcon, EllipsisHorizontalCircleIcon, MinusCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { ChevronDown } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Link from 'next/link';

export function AccordionVote() {
    return (
        <Accordion
            className='flex w-full flex-col  pt-4'
            transition={{ duration: 0.2, ease: 'easeInOut' }}
        >
            <AccordionItem value='vote-pro' className='py-2'>
                <AccordionTrigger className='w-full text-left text-zinc-50'>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center'>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <CheckCircleIcon className="h-6 w-6 text-green-800" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Hlasoval Pro</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <div className='ml-2 text-stone-300'>Novela Duchodové reformy</div>
                        </div>
                        <ChevronDown className='h-4 w-4 text-zinc-50 transition-transform duration-200 group-data-[expanded]:rotate-180' />
                    </div>
                </AccordionTrigger>
                <AccordionContent>
                    <div className='ml-8'>
                        <p className="text-sm text-stone-500 pb-2">Novela důchodové reformy is a legislative proposal aimed at modernizing the pension system to ensure sustainability and fairness for future generations.</p>
                        <Link href="/voting-info" className="text-stone-500 text-sm hover:underline">
                            Více...
                        </Link>
                    </div>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value='vote-against' className='py-2'>
                <AccordionTrigger className='w-full text-left text-zinc-50'>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center'>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <XCircleIcon className="h-6 w-6 text-red-800" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Hlasoval Proti</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <div className='ml-2 text-stone-300'>Zákon o státním rozpočtu</div>
                        </div>
                        <ChevronDown className='h-4 w-4 text-zinc-50 transition-transform duration-200 group-data-[expanded]:rotate-180' />
                    </div>
                </AccordionTrigger>
                <AccordionContent>
                    <div className='ml-8'>
                        <p className="text-sm text-stone-500 pb-2">Zákon o státním rozpočtu is a crucial financial document that outlines the government&apos;s planned revenues and expenditures for the upcoming fiscal year.</p>
                        <Link href="/budget-info" className="text-stone-500 text-sm hover:underline">
                            Více...
                        </Link>
                    </div>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value='vote-abstain' className='py-2'>
                <AccordionTrigger className='w-full text-left text-zinc-50'>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center'>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <MinusCircleIcon className="h-6 w-6 text-stone-500" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Zdržel se</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <div className='ml-2 text-stone-300'>Zákon o ochraně přírody</div>
                        </div>
                        <ChevronDown className='h-4 w-4 text-zinc-50 transition-transform duration-200 group-data-[expanded]:rotate-180' />
                    </div>
                </AccordionTrigger>
                <AccordionContent>
                    <div className='ml-8'>
                        <p className="text-sm text-stone-500 pb-2">Zákon o ochraně přírody aims to preserve natural habitats and biodiversity, ensuring the protection of endangered species and ecosystems.</p>
                        <Link href="/nature-protection-info" className="text-stone-500 text-sm hover:underline">
                            Více...
                        </Link>
                    </div>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value='vote-neutral' className='py-2'>
                <AccordionTrigger className='w-full text-left text-zinc-50'>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center'>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <EllipsisHorizontalCircleIcon className="h-6 w-6 text-stone-500" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Nepřítomen</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <div className='ml-2 text-stone-300'>Zákon o digitální transformaci</div>
                        </div>
                        <ChevronDown className='h-4 w-4 text-zinc-50 transition-transform duration-200 group-data-[expanded]:rotate-180' />
                    </div>
                </AccordionTrigger>
                <AccordionContent>
                    <div className='ml-8'>
                        <p className="text-sm text-stone-500 pb-2">Zákon o digitální transformaci focuses on advancing digital infrastructure and services to enhance the country&apos;s technological capabilities and competitiveness.</p>
                        <Link href="/digital-transformation-info" className="text-stone-500 text-sm hover:underline">
                            Více...
                        </Link>
                    </div>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value='vote-support' className='py-2'>
                <AccordionTrigger className='w-full text-left text-zinc-50'>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center'>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <CheckCircleIcon className="h-6 w-6 text-green-800" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Podporuje</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <div className='ml-2 text-stone-300'>Zákon o vzdělávání</div>
                        </div>
                        <ChevronDown className='h-4 w-4 text-zinc-50 transition-transform duration-200 group-data-[expanded]:rotate-180' />
                    </div>
                </AccordionTrigger>
                <AccordionContent>
                    <div className='ml-8'>
                        <p className="text-sm text-stone-500 pb-2">Zákon o vzdělávání aims to improve the quality of education by implementing new teaching methods and updating the curriculum to meet modern standards.</p>
                        <Link href="/education-law-info" className="text-stone-500 text-sm hover:underline">
                            Více...
                        </Link>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}
