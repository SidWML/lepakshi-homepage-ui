import { notFound } from "next/navigation";
import {
  getCategoryGroupBySlug,
  getCategoriesByParent,
} from "@/lib/data/products";
import ParentContent from "./ParentContent";

interface ParentPageProps {
  params: Promise<{ parent: string }>;
}

export default async function ParentPage({ params }: ParentPageProps) {
  const { parent: parentSlug } = await params;
  const parentGroup = getCategoryGroupBySlug(parentSlug);

  if (!parentGroup) {
    notFound();
  }

  const categories = getCategoriesByParent(parentSlug);

  return <ParentContent parentGroup={parentGroup} categories={categories} />;
}
