import { PAGES } from "@config/pages";
import { redirect } from "next/navigation";

const Page = () => redirect(PAGES.thoughts);

export default Page;
