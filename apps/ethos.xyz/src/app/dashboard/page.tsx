"use client";

import { Box } from "@ethos/ui/system/base/box";
import { Container } from "@ethos/ui/system/base/container";
import {
	AreaSeries,
	Chart,
	TimeScale,
	TimeScaleFitContentTrigger,
} from "lightweight-charts-react-components";

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
			time: Math.floor(currentTime / 1000), // convert to seconds
			value,
		});

		currentTime += 24 * 60 * 60 * 1000; // increment by 1 day
	}

	return data; // strictly ascending by time
}
const data = generateData(100);

const Page = () => {
	return (
		<Container>
			<Box className="border p-4 rounded h-100 w-300">
				<Chart
					options={{
						grid: {
							vertLines: {
								visible: false,
							},
							horzLines: {
								visible: false,
							},
						},
						rightPriceScale: {
							borderVisible: false,
						},
					}}
					containerProps={{
						className: "h-full w-full",
					}}
				>
					<AreaSeries
						data={data}
						options={{
							lineColor: "black",
							topColor: "rgba(35,37,38, 0.9)",
							bottomColor: "rgba(35,37,38, 0)",
						}}
					/>

					<TimeScale options={{ borderVisible: false }}>
						<TimeScaleFitContentTrigger deps={[]} />
					</TimeScale>
				</Chart>
			</Box>
		</Container>
	);
};

export default Page;
