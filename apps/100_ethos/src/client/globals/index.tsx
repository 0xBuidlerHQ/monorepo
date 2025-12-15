import { Cmdk } from "@client/globals/components/cmdk";
import { EventsHandler } from "@client/globals/events";

const Globals = () => {
	return (
		<>
			<EventsHandler />
			<Cmdk />
		</>
	);
};

export { Globals };
