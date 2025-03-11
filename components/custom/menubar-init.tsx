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

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Navigation items configuration
 * Defines the structure of the navigation menu
 */
const navigationItems = [
    {
        path: "/dashboard",
        label: "Dashboard",
        shortcut: "⌘D",
    },
    {
        path: "/character/petr-fiala",
        label: "Dummy Target",
    },
    {
        path: "/manifesto",
        label: "Manifesto",
        shortcut: "⌥S",
    },
];

/**
 * MenubarInit component
 * Provides navigation with breadcrumb-like approach and active page highlighting
 */
export default function MenubarInit() {
    const router = useRouter();
    const pathname = usePathname();
    const [activeItem, setActiveItem] = useState<string | null>(null);
    
    // Set active item based on current pathname
    useEffect(() => {
        if (!pathname) return;
        
        // Find matching navigation item
        const matchingItem = navigationItems.find(item => 
            pathname === item.path || pathname.startsWith(item.path + '/')
        );
        
        if (matchingItem) {
            setActiveItem(matchingItem.path);
        } else {
            setActiveItem(null);
        }
    }, [pathname]);

    // Keyboard shortcuts
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

    // Get active item label for breadcrumb display
    const getActiveItemLabel = () => {
        if (!activeItem) return null;
        const item = navigationItems.find(item => item.path === activeItem);
        return item ? item.label : null;
    };

    // Check if we're on the home page
    const isHomePage = pathname === '/';

    return (
        <div className="flex items-center gap-1 p-1">
            <Menubar className="bg-transparent border-none shadow-none">
                {/* Home menu */}
                <MenubarMenu>
                    <MenubarTrigger 
                        className={`text-sm ${isHomePage ? 'bg-accent text-accent-foreground' : 'hover:bg-accent hover:text-accent-foreground'}`}
                    >
                        Home
                    </MenubarTrigger>
                    <MenubarContent
                        align="start"
                        alignOffset={0}
                        sideOffset={8}
                        className="bg-background border rounded-md shadow-md"
                    >
                        <MenubarItem onSelect={() => handleNavigation("/")}>
                            Go to Home
                        </MenubarItem>
                    </MenubarContent>
                </MenubarMenu>

                {/* Navigation menu */}
                <MenubarMenu>
                    <MenubarTrigger className="hover:bg-accent hover:text-accent-foreground cursor-pointer">
                        Navigation
                    </MenubarTrigger>
                    <MenubarContent 
                        align="start"
                        alignOffset={0}
                        sideOffset={0}
                        className="bg-background border rounded-md shadow-md"
                    >
                        {navigationItems.map((item) => (
                            <MenubarItem 
                                key={item.path}
                                className={`cursor-pointer ${
                                    activeItem === item.path 
                                        ? 'bg-accent text-accent-foreground' 
                                        : 'hover:bg-accent hover:text-accent-foreground'
                                }`}
                                onSelect={() => handleNavigation(item.path)}
                            >
                                {item.label}
                                {item.shortcut && <MenubarShortcut>{item.shortcut}</MenubarShortcut>}
                            </MenubarItem>
                        ))}
                    </MenubarContent>
                </MenubarMenu>
            </Menubar>
            
            {/* Breadcrumb arrow and active page - only shown when not on home page */}
            {activeItem && !isHomePage && (
                <>
                    <span className="mr-1 ml-[-8px] text-muted-foreground flex items-center">
                        <ChevronRight className="h-4 w-4" />
                    </span>
                    
                    <span className="text-sm font-medium">
                        {getActiveItemLabel()}
                    </span>
                </>
            )}
        </div>
    );
}