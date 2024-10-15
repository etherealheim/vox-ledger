"use client";

import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import {
    Area,
    AreaChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

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
    ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A simple area chart showing monthly attendance";

const chartConfig = {
    attendance: {
        label: "Attendance",
        color: "#57534e",
    },
} satisfies ChartConfig;

interface AttendanceData {
    month: string;
    attendancePercentage: number;
}

interface ChartAreaProps {
    handle: string;
}

export function ChartArea({ handle }: ChartAreaProps) {
    const [chartData, setChartData] = useState<AttendanceData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [trend, setTrend] = useState<string>("Trending up by 5.2%");
    const [averageText, setAverageText] = useState<string>("");

    useEffect(() => {
        const fetchData = async () => {
            if (!handle) {
                console.log("No handle provided, skipping fetch.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                console.log(`Fetching data from /api/attendance/${handle}`);
                const response = await fetch(`/api/attendance/${handle}`);
                console.log("Received response status:", response.status);

                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }

                const data: AttendanceData[] = await response.json();
                console.log("Fetched Attendance Data:", data);

                // Validate data
                const validData = data.filter(
                    (d) =>
                        typeof d.attendancePercentage === "number" &&
                        !isNaN(d.attendancePercentage)
                );
                setChartData(validData);
                setLoading(false);

                // Calculate average attendance
                const totalAttendance = validData.reduce((sum, d) => sum + d.attendancePercentage, 0);
                const averageAttendance = validData.length > 0 ? totalAttendance / validData.length : 0;
                const calculatedAverageText = averageAttendance < 60
                    ? "Underperforming"
                    : averageAttendance < 90
                        ? "Could be better"
                        : "Performing well";
                setAverageText(calculatedAverageText);

                // Calculate trend based on the latest two months
                if (validData.length >= 2) {
                    const latest = validData[validData.length - 1].attendancePercentage;
                    const previous = validData[validData.length - 2].attendancePercentage;
                    const difference = latest - previous;
                    const trendPercentage = Math.abs(difference).toFixed(1);
                    if (difference > 0) {
                        setTrend(`Trending up by ${trendPercentage}%`);
                    } else if (difference < 0) {
                        setTrend(`Trending down by ${trendPercentage}%`);
                    } else {
                        setTrend("No change this month");
                    }
                } else {
                    setTrend("Insufficient data to determine trend");
                }
            } catch (error) {
                console.error("Error fetching attendance data:", error);
                setError("Failed to load attendance data.");
                setLoading(false);
            }
        };

        fetchData();
    }, [handle]);

    if (loading) {
        return (
            <Card className="flex flex-col">
                <CardHeader className="items-start pb-0">
                    <CardTitle>Loading Attendance Data...</CardTitle>
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
                        <p>Showing attendance percentages per month</p>
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

    const totalAttendance = chartData.reduce((sum, d) => sum + d.attendancePercentage, 0);
    const averageAttendance = chartData.length > 0 ? totalAttendance / chartData.length : 0;

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-start pb-0">
                <CardTitle>{averageText}</CardTitle>
                <CardDescription className="pb-2">
                    Attendance average of {averageAttendance.toFixed(1)}% YTD
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer config={chartConfig} className="w-full h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={chartData}
                            margin={{
                                top: 10,
                                right: 30,
                                left: 0,
                                bottom: 0,
                            }}
                        >
                            <defs>
                                <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#57534e" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#57534e" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis
                                dataKey="month"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                tickFormatter={(value) => value.slice(0, 3)}
                            />
                            <YAxis
                                domain={[0, 100]}
                                tickFormatter={(value) => `${value}`}
                                tickLine={false}
                                axisLine={false}
                            />
                            <Tooltip
                                content={<ChartTooltipContent />}
                                formatter={(value: number) => ["Attendance: ", `${value}%`]}
                            />
                            <Area
                                type="monotone"
                                dataKey="attendancePercentage"
                                stroke="#78716c"
                                fillOpacity={1}
                                fill="url(#colorAttendance)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                    {trend} <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                    Showing attendance from January to June 2024
                </div>
            </CardFooter>
        </Card>
    );
}
