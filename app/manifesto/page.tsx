import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AboutPage() {
    return (
        <div className="flex justify-center px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-6 gap-4 max-w-3xl">
                <div className="col-span-1 sm:col-span-6 pt-12 sm:pt-24">
                    <h1 className="text-4xl sm:text-5xl font-bold font-[family-name:var(--font-syne-sans)] text-stone-200">
                        Empowering Democracy. Through Transparency. Privately.
                    </h1>
                </div>
                <div className="col-span-1 sm:col-span-3 pt-6 sm:pt-12">
                    <ul className="list-none text-lg sm:text-md font-semibold font-[family-name:var(--font-satoshi-sans)] text-stone-200">
                        <li className="text-xl">Vox [ voks ]:noun</li>
                        <li className="pt-4 text-sm font-[family-name:var(--font-geist-mono)]">voice, tone, expression</li>
                    </ul>
                </div>
                <div className="col-span-1 sm:col-span-3 pt-6 sm:pt-12">
                    <ul className="list-none text-lg sm:text-md font-semibold font-[family-name:var(--font-satoshi-sans)] text-stone-200">
                        <li className="text-xl">Ledger [ lej-er ] : noun</li>
                        <li className="pt-4 text-sm font-[family-name:var(--font-geist-mono)]">an account book or digital file of final entry</li>
                    </ul>
                </div>
                <div className="col-span-1 sm:col-span-6 pt-12 sm:pt-24">
                    <p className="font-normal text-lg sm:text-2xl font-[family-name:var(--font-satoshi-sans)] text-stone-400">
                        In today&apos;s complex political landscape, finding truth can be challenging. That&apos;s where Vox Observer comes in, revolutionizing political transparency through the power of artificial intelligence. This innovative platform analyzes politicians&apos; records, distilling vast amounts of data into clear, actionable insights.
                        <br /><br />My mission is threefold: to provide citizens with transparent, accountable information about their elected officials; to amplify the voice of the people in the democratic process; and to foster a more informed and engaged electorate.
                        <br /><br />Vox Ledger offers comprehensive analysis of voting records, insights into policy positions and their evolution over time, and comparisons between stated intentions and actual actions. I firmly believe that an informed citizenry is the cornerstone of a strong democracy. By using this platform, you&apos;re not just accessing information – you&apos;re becoming part of a movement that&apos;s actively shaping our political future.
                        <br /><br />Join us in strengthening the foundations of democracy. Together, we can create a more transparent, accountable, and responsible government for all nations
                        <br /><br />Embracing the spirit of global cooperation, Vox Ledger is proudly open-source. This project will be available on GitHub, enabling nations worldwide to adapt and implement this tool to enhance understanding of their own governmental processes. By making our technology accessible, we&apos;re fostering a worldwide movement towards greater political transparency and accountability.
                    </p>
                </div>
                <div className="col-span-1 sm:col-span-6 pt-12 pb-24">
                    <h2 className="text-4xl sm:text-5xl font-bold font-[family-name:var(--font-syne-sans)] text-stone-200">
                        Consider Donation.
                    </h2>
                    <p className="font-normal text-lg sm:text-2xl font-[family-name:var(--font-satoshi-sans)] text-stone-400 pb-6 pt-6">
                        The Text-to-Speech and Text-to-Text analysis technologies utilized in this project remain significantly costly per token. If you believe this project has the potential to impact the world positively, please consider making a donation via Bitcoin or Solana.
                    </p>
                    <Tabs defaultValue="bitcoin">
                        <TabsList>
                            <TabsTrigger value="bitcoin">Bitcoin</TabsTrigger>
                            <TabsTrigger value="solana">Solana</TabsTrigger>
                        </TabsList>
                        <TabsContent value="bitcoin">bc1qfarps20tkwlzv5r4d36zdr5fsmpvzn3f9a5azq</TabsContent>
                        <TabsContent value="solana">6xnw3DJhk7Mmi62TyxMfPFBTn7yXKWiTzEWdsz4vFZvt</TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}