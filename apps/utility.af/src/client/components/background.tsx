import { Box } from "@0xbuidlerhq/ui/system/base/box";

const Background = () => {
	return (
		<Box
			className="
        absolute h-full w-full -z-10
        [--dot-opacity:0.15]          
        bg-[radial-gradient(circle,_rgba(100,100,100,var(--dot-opacity))_1px,_transparent_1px)]
        [background-size:20px_20px]
      "
		/>
	);
};

export { Background };
