"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

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

const formatDate = (timestamp) => {
	const date = new Date(timestamp);
	const day = String(date.getDate()).padStart(2, "0");
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const year = date.getFullYear();
	return `${day}/${month}`;
};

// custom tick formatter
const tickFormatter = (value, index, ticks) => {
	const date = new Date(value);
	const formatted = formatDate(value);

	// Force tick at the first day of each year
	if (date.getDate() === 1 && date.getMonth() === 0) {
		return formatted; // 01/01/yyyy
	}

	// Otherwise, return formatted normally
	return formatted;
};

const DashboardChart = () => {
	return (
		<ResponsiveContainer height="100%" width="100%" className="min-h-60">
			<AreaChart data={data} className="h-full w-full">
				<defs>
					<linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
						<stop offset="5%" stopColor="#00000" stopOpacity={0.8} />
						<stop offset="95%" stopColor="#000000" stopOpacity={0} />
					</linearGradient>
				</defs>

				<XAxis
					dataKey="time"
					axisLine={false}
					tickLine={false}
					stroke="#000000"
					fontSize={10}
					tickFormatter={tickFormatter}
					interval="preserveStart"
				/>

				<YAxis
					direction="right"
					orientation="right"
					axisLine={false}
					tickLine={false}
					stroke="#000000"
					fontSize={12}
					interval="preserveEnd"
				/>

				<Tooltip />

				<Area
					type="monotone"
					dataKey="value"
					stroke="#000000"
					strokeWidth={2}
					fillOpacity={1}
					fill="url(#colorUv)"
				/>
			</AreaChart>
		</ResponsiveContainer>
	);
};

export { DashboardChart };
