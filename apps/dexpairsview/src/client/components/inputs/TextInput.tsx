type TextInputProps = {
	value: string;
	setValue: (str: string) => void;
};

const TextInput = (props: TextInputProps) => {
	const { value, setValue } = props;

	return (
		<input
			className="bg-accent w-full p-4 rounded"
			value={value}
			onChange={(e) => setValue(e.currentTarget.value)}
			placeholder="Search pairs..."
		/>
	);
};

export { TextInput };
