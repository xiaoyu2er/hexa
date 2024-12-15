// 'use client';

// import { type TimeRange, useTimeSeriesData } from '@/hooks/use-analytics';
// import { ChartContainer, ChartTooltip } from '@hexa/ui/chart';
// import { Skeleton } from '@nextui-org/skeleton';
// import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

// // Custom tooltip content
// const CustomTooltip = ({ active, payload, label }: any) => {
//   if (!active || !payload) return null;

//   return (
//     <div className="rounded-lg border bg-background p-2 shadow-sm">
//       <div className="grid gap-2">
//         <div className="font-medium">
//           {new Date(label).toLocaleDateString()}
//         </div>
//         {payload.map((entry: any) => (
//           <div key={entry.name} className="flex items-center gap-2">
//             <div
//               className="h-2 w-2 rounded-full"
//               style={{ backgroundColor: entry.color }}
//             />
//             <span className="font-medium">
//               {entry.name === 'visitors' ? 'Unique Visitors' : 'Total Visits'}:
//             </span>
//             <span>{entry.value.toLocaleString()}</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export function TimeSeries({ timeRange }: { timeRange: TimeRange }) {
//   const { data, isLoading, error } = useTimeSeriesData(timeRange);

//   if (isLoading) {
//     return <Skeleton className="h-[300px] w-full" />;
//   }

//   if (error) {
//     return <div>Failed to load chart data</div>;
//   }

//   const chartData =
//     data?.data?.map((item) => ({
//       date: item.date,
//       visitors: Number.parseInt(item.visitors ?? '0', 10),
//       visits: Number.parseInt(item.visits ?? '0', 10),
//     })) ?? [];

//   return (
//     <ChartContainer
//       config={{
//         visitors: {
//           theme: 'chart-1',
//         },
//         visits: {
//           theme: 'chart-2',
//         },
//       }}
//     >
//       <div className="h-[300px]">
//         <ResponsiveContainer width="100%" height="100%">
//           <AreaChart
//             data={chartData}
//             margin={{
//               top: 5,
//               right: 10,
//               left: 10,
//               bottom: 0,
//             }}
//           >
//             <XAxis
//               dataKey="date"
//               tickLine={false}
//               axisLine={false}
//               tickFormatter={(value) => new Date(value).toLocaleDateString()}
//             />
//             <YAxis
//               tickLine={false}
//               axisLine={false}
//               tickFormatter={(value) => value.toLocaleString()}
//             />
//             <ChartTooltip content={<CustomTooltip />} />
//             <Area
//               type="monotone"
//               dataKey="visitors"
//               name="visitors"
//               stroke="hsl(var(--chart-1))"
//               fill="hsl(var(--chart-1))"
//               fillOpacity={0.2}
//             />
//             <Area
//               type="monotone"
//               dataKey="visits"
//               name="visits"
//               stroke="hsl(var(--chart-2))"
//               fill="hsl(var(--chart-2))"
//               fillOpacity={0.2}
//             />
//           </AreaChart>
//         </ResponsiveContainer>
//       </div>
//     </ChartContainer>
//   );
// }
