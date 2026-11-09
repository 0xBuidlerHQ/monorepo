import { notFound } from "next/navigation";
import { getGradedItem, gradedItems } from "@/features/items/catalog";
import { ItemDetail } from "@/features/items/item-detail";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
 return gradedItems.map((item) => ({ id: item.id }));
}

export async function generateMetadata({ params }: Props) {
 const item = getGradedItem((await params).id);
 return { title: item ? `${item.name} · Digital passport` : "Item not found" };
}

export default async function ItemPage({ params }: Props) {
 const item = getGradedItem((await params).id);
 if (!item) notFound();
 return <ItemDetail item={item} />;
}
