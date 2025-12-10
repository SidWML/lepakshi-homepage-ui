import { notFound } from "next/navigation";
import {
  getCategoryBySlug,
  getCategoryGroupBySlug,
  getProductsByCategory,
} from "@/lib/data/products";
import CategoryContent from "./CategoryContent";

interface CategoryPageProps {
  params: Promise<{ parent: string; category: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { parent: parentSlug, category: categorySlug } = await params;

  const parentGroup = getCategoryGroupBySlug(parentSlug);
  const category = getCategoryBySlug(categorySlug);

  if (!parentGroup || !category || category.parentSlug !== parentSlug) {
    notFound();
  }

  const products = getProductsByCategory(category.id);

  return <CategoryContent parentGroup={parentGroup} category={category} products={products} />;
}
