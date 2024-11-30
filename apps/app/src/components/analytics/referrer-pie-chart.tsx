// 'use client';

// import { type TimeRange, useLogsData } from '@/hooks/use-analytics';
// import { ChartContainer, ChartTooltip } from '@hexa/ui/chart';
// import { Skeleton } from '@hexa/ui/skeleton';
// import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

// const COLORS = [
//   'hsl(var(--chart-1))',
//   'hsl(var(--chart-2))',
//   'hsl(var(--chart-3))',
//   'hsl(var(--chart-4))',
//   'hsl(var(--chart-5))',
// ];

// // Custom tooltip content
// const CustomTooltip = ({ active, payload }: any) => {
//   if (!active || !payload?.[0]) return null;

//   return (
//     <div className="rounded-lg border bg-background p-2 shadow-sm">
//       <div className="grid gap-2">
//         <div className="font-medium">{payload[0].name}</div>
//         <div className="flex items-center gap-2">
//           <div
//             className="h-2 w-2 rounded-full"
//             style={{ backgroundColor: payload[0].color }}
//           />
//           <span>Visitors: {payload[0].value.toLocaleString()}</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export function ReferrerPieChart({ timeRange }: { timeRange: TimeRange }) {
//   const { data, isLoading, error } = useLogsData('referrer', timeRange);

//   if (isLoading) {
//     return <Skeleton className="h-[300px] w-full" />;
//   }

//   if (error) {
//     return <div>Failed to load chart data</div>;
//   }

//   const chartData =
//     data?.data?.map((item) => ({
//       name: item.referrer || 'Direct',
//       value: Number.parseInt(item.visitors ?? '0', 10),
//     })) ?? [];

//   return (
//     <ChartContainer
//       config={{
//         value: {
//           theme: 'chart-1',
//         },
//       }}
//     >
//       <div className="h-[300px]">
//         <ResponsiveContainer width="100%" height="100%">
//           <PieChart>
//             <Pie
//               data={chartData}
//               cx="50%"
//               cy="50%"
//               labelLine={false}
//               outerRadius={80}
//               fill="#8884d8"
//               dataKey="value"
//             >
//               {chartData.map((_, index) => (
//                 <Cell
//                   key={`cell-${index}`}
//                   fill={COLORS[index % COLORS.length]}
//                 />
//               ))}
//             </Pie>
//             <ChartTooltip content={<CustomTooltip />} />
//           </PieChart>
//         </ResponsiveContainer>
//       </div>
//     </ChartContainer>
//   );
// }
