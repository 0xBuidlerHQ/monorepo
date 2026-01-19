import { ToolCategories, Tools } from "@config/tools";
import { useForm, useStore } from "@tanstack/react-form";
import { useMemo } from "react";

/**
 * @dev useToolsSearch.
 */
const useToolsSearch = () => {
	const form = useForm({
		defaultValues: {
			search: "",
			categories: ToolCategories,
		},
	});

	const store = useStore(form.store);

	const tools = useMemo(() => {
		const search = store.values.search ?? "";
		const selectedCategories = (store.values.categories ?? []) as string[];
		const query = search.trim().toLowerCase();

		return Object.values(Tools).filter((item) => {
			const matchesSearch = !query || `${item.name} ${item.subtitle}`.toLowerCase().includes(query);
			const matchesCategory =
				selectedCategories.length === 0 || selectedCategories.includes(item.category);

			return matchesSearch && matchesCategory;
		});
	}, [store.values.categories, store.values.search]);

	return { form, tools };
};

type ToolsSearchForm = ReturnType<typeof useToolsSearch>["form"];

type ToolsSearchFormProps = {
	form: ToolsSearchForm;
};

export { useToolsSearch, type ToolsSearchForm, type ToolsSearchFormProps };
