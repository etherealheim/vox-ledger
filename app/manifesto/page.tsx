export default function AboutPage() {
    return (
        <div className="flex justify-center">
            <div className="grid grid-cols-6 gap-4 max-w-3xl">
                <div className="col-span-6 pt-24">
                    <p className="text-6xl font-bold font-[family-name:var(--font-syne-sans)] text-stone-200" >Empowering Democracy. Through Transparency. Privately.</p>
                </div>
                <div className="col-span-3 pt-12">
                    <ul className=" list-none text-md font-semibold font-[family-name:var(--font-satoshi-sans)] text-stone-200">
                        <li>Vox [ voks ]:noun</li>
                        <li>Voice</li>
                    </ul>
                </div>
                <div className="col-span-3 pt-12">
                    <ul className="list-none text-md font-semibold font-[family-name:var(--font-satoshi-sans)] text-stone-200">
                        <li>Observer [ uhb-zur-ver ]:noun</li>
                        <li>Observing</li>
                    </ul>
                </div>
                <div className="col-span-6 pt-24">
                    <p className="font-normal text-2xl font-[family-name:var(--font-satoshi-sans)] text-stone-400 pb-32">
                        In today&apos;s complex political landscape, finding truth can be challenging. That&apos;s where Vox Observer comes in, revolutionizing political transparency through the power of artificial intelligence. This innovative platform analyzes politicians&apos; records, distilling vast amounts of data into clear, actionable insights.
                        <br /><br />My mission is threefold: to provide citizens with transparent, accountable information about their elected officials; to amplify the voice of the people in the democratic process; and to foster a more informed and engaged electorate.
                        <br /><br />Vox Observer offers comprehensive analysis of voting records, insights into policy positions and their evolution over time, and comparisons between stated intentions and actual actions. I firmly believe that an informed citizenry is the cornerstone of a strong democracy. By using this platform, you&apos;re not just accessing information – you&apos;re becoming part of a movement that&apos;s actively shaping our political future.
                        <br /><br />Join us in strengthening the foundations of democracy. Together, we can create a more transparent, accountable, and responsible government for all nations
                        <br /><br />Embracing the spirit of global cooperation, Vox Observer is proudly open-source. This project will be available on GitHub, enabling nations worldwide to adapt and implement this tool to enhance understanding of their own governmental processes. By making our technology accessible, we&apos;re fostering a worldwide movement towards greater political transparency and accountability.
                    </p>
                </div>
            </div>
        </div >
    );
}
