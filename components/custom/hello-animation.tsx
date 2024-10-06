"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const HelloAnimation = (): JSX.Element => {
    const texts: string[] = [
        "Hello World.",
        "It's time to wake up.",
        "It's time to make them accountable.",
        "It's time for Vox Observer."
    ];
    const [currentTextIndex, setCurrentTextIndex] = useState<number>(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
        }, 3000); // Change text every 4.5 seconds to allow full transition

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="h-screen flex items-center justify-center">
            <section className="container mx-auto">
                <AnimatePresence mode="wait">
                    <motion.h1
                        key={currentTextIndex}
                        className="text-2xl font-normal text-center"
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