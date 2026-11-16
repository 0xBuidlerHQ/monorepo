import { TrueOriginsMark } from "./icons/trueorigins-mark";

export function OriginLogo({ className = "" }: { className?: string }) {
	return <TrueOriginsMark className={`text-brand-accent ${className}`} />;
}
