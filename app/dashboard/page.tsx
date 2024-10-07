import MenubarInit from "@/components/custom/menubar-init";
import SearchBox from "@/components/custom/search-box";
import localFont from "next/font/local";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

const geistMono = localFont({
    src: "../fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export default function Dashboard() {
    return (
        <div>
            <div className="absolute bottom-4 left-4">
                <MenubarInit />
            </div>
            <section className="h-screen flex flex-col justify-center">
                <div className="text-center mb-8 mt-[-120px]">
                    <p className={`${geistMono.variable} text-xl font-mono font-medium text-stone-400 pb-2`}>Welcome…&nbsp;
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
                    <p className="text-md text-stone-600 font-mono">Search for your favourite public figure.</p>

                </div>
                <SearchBox />
            </section >
        </div >
    );
}

