"use client";
import { useState } from "react";
import { ChevronUpIcon } from '@heroicons/react/24/outline'


const Ranking = (): JSX.Element => {
    const [karma, setKarma] = useState<number>(0);
    const [vote, setVote] = useState<"up" | "down" | null>(null);

    const handleUpVote = () => {
        if (vote === "up") {
            setKarma(karma - 1);
            setVote(null);
        } else {
            setKarma(vote === "down" ? karma + 2 : karma + 1);
            setVote("up");
        }
    };

    const handleDownVote = () => {
        if (vote === "down") {
            setKarma(karma + 1);
            setVote(null);
        } else {
            setKarma(vote === "up" ? karma - 2 : karma - 1);
            setVote("down");
        }
    };

    return (
        <div className="flex items-center space-x-4">
            <button
                onClick={handleUpVote}
                className={`p-2 rounded-full ${vote === "up" ? "bg-green-500" : "bg-gray-300"}`}
            >
                <ChevronUpIcon className="text-black" />
            </button>
            <span className="text-xl font-semibold">{karma}</span>
            <button
                onClick={handleDownVote}
                className={`p-2 rounded-full ${vote === "down" ? "bg-red-500" : "bg-gray-300"}`}
            >
                <ChevronUpIcon className="text-white" />
            </button>
        </div>
    );
};

export default Ranking;

