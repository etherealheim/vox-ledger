import SearchBox from "@/components/custom/search-box";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

export default function Dashboard() {
    return (
        <div>
            <section className="container mx-auto grid-cols-12">
                <div className="col-span-12 text-center mb-8 pt-48 font-[family-name:var(--font-geist-mono)]">
                    <p className="text-xl font-medium text-stone-400 pb-2">Welcome…&nbsp;
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <p>user.</p>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>I care about you, not your identity.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </p>
                    <p className="text-md text-stone-600">Search for your favourite public figure.</p>

                </div>
                <div className="col-span-12">
                    <SearchBox autoFocus={true} />
                </div>
            </section >
        </div >
    );
}

