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

import Link from "next/link";
import { useEffect } from "react";

export default function MenubarInit() {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.altKey && e.key === 'a') {
                e.preventDefault();
                window.location.href = "/dashboard";
            } else if (e.altKey && e.key === 's') {
                e.preventDefault();
                window.location.href = "/manifesto";
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <Menubar>
            <MenubarMenu>
                <MenubarTrigger>
                    <Link href="/">Home</Link>
                </MenubarTrigger>

            </MenubarMenu>
            <MenubarMenu>
                <MenubarTrigger>Navigation</MenubarTrigger>
                <MenubarContent>
                    <MenubarItem className="flex justify-between">
                        <Link href="/dashboard">
                            Dashboard
                        </Link>
                        <MenubarShortcut>⌥A</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem className="flex justify-between">
                        <Link href="/character/miroslav-kalousek">
                            Dummy Target
                        </Link>
                    </MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem className="flex justify-between">
                        <Link href="/manifesto">
                            Manifesto
                        </Link>
                        <MenubarShortcut>⌥S</MenubarShortcut>
                    </MenubarItem>
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    );
}