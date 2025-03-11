"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
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

/**
 * Chart configuration for attendance data
 * Defines the label and color for the chart
 */
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

/**
 * Area chart component that displays attendance data over time
 * Fetches data from the API and displays it in a responsive chart
 */
export function ChartArea({ handle }: ChartAreaProps) {
    const [chartData, setChartData] = useState<AttendanceData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [trend, setTrend] = useState<string>("Trending up by 5.2%");
    const [averageText, setAverageText] = useState<string>("");

    /**
     * Calculates the average attendance from the provided data
     */
    const calculateAverageText = useCallback((data: AttendanceData[]) => {
        const totalAttendance = data.reduce((sum, d) => sum + d.attendancePercentage, 0);
        const averageAttendance = data.length > 0 ? totalAttendance / data.length : 0;
        
        if (averageAttendance < 60) return "Underperforming";
        if (averageAttendance < 90) return "Could be better";
        return "Performing well";
    }, []);

    /**
     * Calculates the trend based on the last three months of data
     */
    const calculateTrend = useCallback((data: AttendanceData[]) => {
        if (data.length < 3) return "Insufficient data";
        
        const latest = data.slice(-3).map(d => d.attendancePercentage);
        const firstTwo = (latest[0] + latest[1]) / 2;
        const last = latest[2];
        const change = last - firstTwo;
        const percentChange = (change / firstTwo) * 100;
        
        if (Math.abs(percentChange) < 1) return "Stable";
        
        const direction = percentChange > 0 ? "up" : "down";
        return `Trending ${direction} by ${Math.abs(percentChange).toFixed(1)}%`;
    }, []);

    // Fetch attendance data when the handle changes
    useEffect(() => {
        const fetchData = async () => {
            if (!handle) {
                setError("No handle provided");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                
                const response = await fetch(`/api/attendance/${handle}`);

                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }

                const data: AttendanceData[] = await response.json();

                // Validate and filter data for the last 6 months
                const validData = data
                    .filter(
                        (d) =>
                            typeof d.attendancePercentage === "number" &&
                            !isNaN(d.attendancePercentage)
                    )
                    .slice(-6); // Only keep the last 6 months of data
                
                setChartData(validData);
                setAverageText(calculateAverageText(validData));
                setTrend(calculateTrend(validData));
                
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to fetch attendance data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [handle, calculateAverageText, calculateTrend]);

    // Memoize the chart content to prevent unnecessary re-renders
    const chartContent = useMemo(() => {
        if (loading) {
            return <div className="flex items-center justify-center h-[300px]">Loading chart data...</div>;
        }

        if (error) {
            return <div className="flex items-center justify-center h-[300px] text-destructive">{error}</div>;
        }

        if (chartData.length === 0) {
            return <div className="flex items-center justify-center h-[300px]">No attendance data available</div>;
        }

        return (
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                    data={chartData}
                    margin={{
                        top: 20,
                        right: 20,
                        bottom: 20,
                        left: 0,
                    }}
                >
                    <defs>
                        <linearGradient id="attendance" x1="0" y1="0" x2="0" y2="1">
                            <stop
                                offset="5%"
                                stopColor={chartConfig.attendance.color}
                                stopOpacity={0.3}
                            />
                            <stop
                                offset="95%"
                                stopColor={chartConfig.attendance.color}
                                stopOpacity={0}
                            />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={10}
                        padding={{ left: 10, right: 10 }}
                    />
                    <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickMargin={10}
                        domain={[0, 100]}
                        tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                return (
                                    <div className="rounded-lg border bg-background p-2 shadow-md">
                                        <div className="font-medium">{payload[0].payload.month}</div>
                                        <div className="text-sm text-muted-foreground">
                                            Attendance: <span className="font-medium text-foreground">{payload[0].value}%</span>
                                        </div>
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                    <Area
                        type="monotone"
                        dataKey="attendancePercentage"
                        stroke={chartConfig.attendance.color}
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#attendance)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        );
    }, [chartData, loading, error]);

    // Memoize the trend indicator to prevent unnecessary re-renders
    const trendIndicator = useMemo(() => {
        if (trend.includes("up")) {
            return (
                <div className="flex items-center text-green-600">
                    <TrendingUp className="mr-1 h-4 w-4" />
                    <span>{trend}</span>
                </div>
            );
        }
        
        if (trend.includes("down")) {
            return (
                <div className="flex items-center text-red-600">
                    <TrendingDown className="mr-1 h-4 w-4" />
                    <span>{trend}</span>
                </div>
            );
        }
        
        return <div>{trend}</div>;
    }, [trend]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Attendance</CardTitle>
                <CardDescription>Monthly attendance percentage</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    {chartContent}
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-2">
                <div className="text-sm font-medium">{averageText}</div>
                <div className="text-xs text-muted-foreground">
                    {trendIndicator}
                </div>
            </CardFooter>
        </Card>
    );
}
