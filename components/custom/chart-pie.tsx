"use client";

import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { Pie, PieChart, Cell, Label } from "recharts";
import { Switch } from "@/components/ui/switch"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A donut chart";

const chartConfig = {
    yes: {
        label: "Yes",
        color: "#166534",
    },
    no: {
        label: "No",
        color: "#7f1d1d",
    },
    abstain: {
        label: "Abstain",
        color: "#44403c",
    },
    "not logged in": {
        label: "Not Logged",
        color: "#1c1917",
    },
    refrained: {
        label: "Refrained",
        color: "#44403c", // Added new vote type color
    },
} satisfies ChartConfig;

type VoteType = keyof typeof chartConfig;

interface VoteData {
    votes: {
        politicianName: string;
        vote: string; // Keep as string to normalize dynamically
    };
}

interface ChartDataItem {
    name: string;
    value: number;
    fill: string;
}

interface ChartPieProps {
    handle: string;
}

export function ChartPie({ handle }: ChartPieProps) {
    const [chartData, setChartData] = useState<ChartDataItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [majorityLabel, setMajorityLabel] = useState<string>("Mostly Agreeable");


    useEffect(() => {
        if (handle) {
            setLoading(true);
            fetch(`/api/voting/${handle}`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then((data: VoteData[]) => {
                    console.log("Fetched Data:", data); // Log the fetched data

                    // Normalize votes (case-insensitive)
                    const counts = data.reduce<Record<VoteType, number>>((acc, item) => {
                        const vote = item.votes.vote.toLowerCase() as VoteType; // Normalize to lowercase
                        if (chartConfig[vote]) {
                            acc[vote] = (acc[vote] || 0) + 1;
                        }
                        return acc;
                    }, {} as Record<VoteType, number>);

                    console.log("Vote Counts:", counts); // Log the vote counts

                    // Transform the counts into chart-friendly data
                    const transformedData: ChartDataItem[] = (Object.keys(chartConfig) as VoteType[]).map(
                        (vote) => ({
                            name: chartConfig[vote]?.label || vote,
                            value: counts[vote] || 0, // Default to 0 if not present
                            fill: getColorForVote(vote),
                        })
                    );

                    // Function to determine the majority label based on vote counts
                    const determineMajorityLabel = (counts: Record<VoteType, number>): string => {
                        const majorityVote = Object.entries(counts).reduce<[VoteType, number]>((max, entry) => {
                            return entry[1] > max[1] ? [entry[0] as VoteType, entry[1]] : max;
                        }, ["yes", 0]);

                        const isTied = Object.values(counts).filter(count => count === majorityVote[1]).length > 1;

                        const majorityLabelMap: Record<VoteType, string> = {
                            yes: "Mostly Agreeable",
                            no: "Mostly Disagreeable",
                            abstain: "Mostly Abstained",
                            "not logged in": "Mostly Not Logged In",
                            refrained: "Mostly Refrained",
                        };

                        return isTied ? "Undecided" : (majorityLabelMap[majorityVote[0]] || "Mostly Agreeable");
                    };

                    const majorityLabel = determineMajorityLabel(counts);
                    setMajorityLabel(majorityLabel);

                    console.log("Majority Label:", majorityLabel);

                    console.log("Transformed Data:", transformedData); // Log the transformed data

                    setChartData(transformedData);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching data:", error);
                    setError('Failed to load voting data.');
                    setLoading(false);
                });
        }
    }, [handle]);

    const getColorForVote = (vote: VoteType) => {
        return chartConfig[vote]?.color || "hsl(var(--chart-1))";
    };

    if (loading) {
        return (
            <Card className="flex flex-col">
                <CardHeader className="items-start pb-0">
                    <CardTitle>Loading Voting Results...</CardTitle>
                    <CardDescription>Please wait while we fetch the data.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 pb-0">
                    <div className="mx-auto aspect-square max-h-[250px] flex items-center justify-center">
                        <p>Loading...</p>
                    </div>
                </CardContent>
                <CardFooter className="flex-col gap-2 text-sm">
                    <div className="flex items-center gap-2 font-medium leading-none">
                        <p>Loading trend...</p>
                    </div>
                    <div className="leading-none text-muted-foreground">
                        <p>Showing total votes for the current session</p>
                    </div>
                </CardFooter>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="flex flex-col">
                <CardHeader className="items-start pb-0">
                    <CardTitle>Error</CardTitle>
                    <CardDescription>{error}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 pb-0">
                    <div className="mx-auto aspect-square max-h-[250px] flex items-center justify-center">
                        <p>{error}</p>
                    </div>
                </CardContent>
                <CardFooter className="flex-col gap-2 text-sm">
                    <div className="flex items-center gap-2 font-medium leading-none">
                        <p>Unable to display trend.</p>
                    </div>
                    <div className="leading-none text-muted-foreground">
                        <p>Please try again later.</p>
                    </div>
                </CardFooter>
            </Card>
        );
    }

    return (
        <Card className="flex flex-col font-[family-name:var(--font-satoshi-sans)]">
            <CardHeader className="flex justify-between items-stretch pb-0">
                <CardTitle className="flex items-stretch gap-2 justify-between">
                    {majorityLabel}

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <div className="flex items-center gap-2">
                                    <Switch />
                                    <span className="text-sm text-muted-foreground">All Time</span>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>All Time</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                </CardTitle>
                <CardDescription>Overview of voting sessions YTD</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={60}
                            strokeWidth={5}
                            aria-label="Voting Results Pie Chart"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-3xl font-bold"
                                                >
                                                    {chartData.reduce((acc, entry) => acc + entry.value, 0).toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    Votes
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                    &quot;Yes&quot; is trending up by 5.2% this month{" "}
                    <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                    Showing total votes for the current session
                </div>
            </CardFooter>
        </Card>
    );
}
