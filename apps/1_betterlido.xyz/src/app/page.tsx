import { PAGES } from "@config/pages";
import { redirect } from "next/navigation";

const Page = () => redirect(PAGES.rewards);

export default Page;
