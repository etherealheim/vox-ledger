import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import MenubarInit from "@/components/custom/menubar-init";

export default function Dashboard() {
    return (
        <div>
            <div className="absolute bottom-4 left-4">
                <MenubarInit />
            </div>
            <section className="h-screen flex flex-col justify-center">
                <div className="text-center mb-8 mt-[-120px]">
                    <p className="text-xl text-stone-400 pb-2">Welcome User.</p>
                    <p className="text-md text-stone-600">Search for your favourite public figure.</p>
                </div>
                <div className="flex mx-auto space-x-4 w-full max-w-2xl items-center">
                    <Input type="search" placeholder="Search" className="flex-grow" />
                    <Button type="submit" variant="outline">Search</Button>
                </div>
            </section>
        </div>
    );
}
