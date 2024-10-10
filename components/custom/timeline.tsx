import React from 'react';

export default function Timeline() {
    return (
        <div className='pt-12'>
            <h2 className='text-3xl font-bold font-[family-name:var(--font-syne-sans)] text-stone-200 pb-6'>Timeline</h2>
            <ol className="relative border-s font-[family-name:var(--font-satoshi-sans)]">
                <li className="mb-4 ms-4">
                    <div className="absolute w-3 h-3 bg-stone-500 rounded-full mt-1.5 -start-1.5"></div>
                    <time className="mb-1 text-sm leading-none text-stone-500">May 2003</time>
                    <h3 className="text-md font-semibold text-stone-500 font-[family-name:var(--font-satoshi-sans)]">Appointed Minister of Finance</h3>
                </li>
                <li className="mb-4 ms-4">
                    <div className="absolute w-3 h-3 bg-stone-500 rounded-full mt-1.5 -start-1.5"></div>
                    <time className="mb-1 text-sm leading-none text-stone-500">July 2010</time>
                    <h3 className="text-md font-semibold text-stone-500 font-[family-name:var(--font-satoshi-sans)]">Re-elected as Member of Parliament</h3>
                </li>
                <li className="ms-4">
                    <div className="absolute w-3 h-3 bg-stone-500 rounded-full mt-1.5 -start-1.5"></div>
                    <time className="mb-1 text-sm leading-none text-stone-500">October 2013</time>
                    <h3 className="text-md font-semibold text-stone-500 font-[family-name:var(--font-satoshi-sans)]">Resigned from TOP 09 Leadership</h3>
                </li>
            </ol>
        </div>
    );
}
