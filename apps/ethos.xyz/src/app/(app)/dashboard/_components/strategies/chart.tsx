"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts";

type DataPoint = {
	time: number;
	value: number;
};
function generateData(numPoints: number, startDate: string = "2023-01-01"): DataPoint[] {
	const data: DataPoint[] = [];
	let currentTime = new Date(startDate).getTime(); // milliseconds since epoch

	let value = 100; // starting value
	for (let i = 0; i < numPoints; i++) {
		// slowly increase value by a small random amount
		const increment = Math.random() * 10; // adjust max increment as needed
		value = parseFloat((value + increment).toFixed(2));

		data.push({
			time: Math.floor(currentTime), // convert to seconds
			value,
		});

		currentTime += 24 * 60 * 60 * 1000; // increment by 1 day
	}

	return data; // strictly ascending by time
}

const data = generateData(100);

const StategyChart = () => {
	return (
		<ResponsiveContainer height="100%" width="100%">
			<AreaChart
				data={data}
				className="h-full w-full"
				margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
			>
				<defs>
					<linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
						<stop offset="5%" stopColor="#000000" stopOpacity={1} />
						<stop offset="95%" stopColor="#000000" stopOpacity={0} />
					</linearGradient>
				</defs>

				<Tooltip />

				<Area
					type="monotone"
					dataKey="value"
					stroke="#aaaaaa"
					strokeWidth={1}
					fillOpacity={0.2}
					fill="url(#colorUv)"
				/>
			</AreaChart>
		</ResponsiveContainer>
	);
};

export { StategyChart };
