"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const HelloAnimation = (): JSX.Element => {
    const texts: string[] = [
        "Hello World.",
        "It's time to wake up.",
        "It's time to make them accountable.",
        "It's time to make you better informed.",
        "It's time for Vox Ledger."
    ];
    const [currentTextIndex, setCurrentTextIndex] = useState<number>(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
        }, 4000);

        return () => clearInterval(interval);
    }, [texts.length]);

    return (
        <div className="h-screen flex items-center justify-center my-[-64px]">
            <section className="container mx-auto ">
                <AnimatePresence mode="wait">
                    <motion.h1
                        key={currentTextIndex}
                        className="text-2xl font-normal text-center text-stone-400"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5 }}
                    >
                        {texts[currentTextIndex]}
                    </motion.h1>
                </AnimatePresence>
            </section>
        </div>
    );
};

export default HelloAnimation;