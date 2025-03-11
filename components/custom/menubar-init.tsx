"use client";

import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarShortcut,
    MenubarTrigger,
} from "@/components/ui/menubar"

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MenubarInit() {
    const router = useRouter();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Command+D for Dashboard (metaKey for Mac, ctrlKey for Windows/Linux)
            if ((e.metaKey || e.ctrlKey) && e.key === 'd') {
                e.preventDefault();
                router.push("/dashboard");
            } else if (e.altKey && e.key === 's') {
                e.preventDefault();
                router.push("/manifesto");
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [router]);

    const handleNavigation = (path: string) => {
        router.push(path);
    };

    return (
        <Menubar className="bg-transparent border-none shadow-none">
            <MenubarMenu>
                <MenubarTrigger 
                    className="hover:bg-accent hover:text-accent-foreground cursor-pointer"
                    onClick={() => handleNavigation("/")}
                >
                    Home
                </MenubarTrigger>
            </MenubarMenu>
            
            <MenubarMenu>
                <MenubarTrigger className="hover:bg-accent hover:text-accent-foreground cursor-pointer">
                    Navigation
                </MenubarTrigger>
                <MenubarContent 
                    align="start"
                    alignOffset={0}
                    sideOffset={8}
                    className="bg-background border rounded-md shadow-md"
                >
                    <MenubarItem 
                        className="cursor-pointer hover:bg-accent hover:text-accent-foreground" 
                        onSelect={() => handleNavigation("/dashboard")}
                    >
                        Dashboard
                        <MenubarShortcut>⌘D</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem 
                        className="cursor-pointer hover:bg-accent hover:text-accent-foreground" 
                        onSelect={() => handleNavigation("/character/petr-fiala")}
                    >
                        Dummy Target
                    </MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem 
                        className="cursor-pointer hover:bg-accent hover:text-accent-foreground" 
                        onSelect={() => handleNavigation("/manifesto")}
                    >
                        Manifesto
                        <MenubarShortcut>⌥S</MenubarShortcut>
                    </MenubarItem>
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    );
}