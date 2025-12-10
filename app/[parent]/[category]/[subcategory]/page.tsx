import { notFound } from "next/navigation";
import {
  getCategoryBySlug,
  getCategoryGroupBySlug,
  getProductsBySubcategory,
} from "@/lib/data/products";
import SubcategoryContent from "./SubcategoryContent";

interface SubcategoryPageProps {
  params: Promise<{ parent: string; category: string; subcategory: string }>;
}

export default async function SubcategoryPage({ params }: SubcategoryPageProps) {
  const { parent: parentSlug, category: categorySlug, subcategory: subcategorySlug } = await params;

  const parentGroup = getCategoryGroupBySlug(parentSlug);
  const category = getCategoryBySlug(categorySlug);

  if (!parentGroup || !category || category.parentSlug !== parentSlug) {
    notFound();
  }

  const subcategory = category.subcategories.find(s => s.slug === subcategorySlug);

  if (!subcategory) {
    notFound();
  }

  const products = getProductsBySubcategory(subcategory.id);

  return (
    <SubcategoryContent
      parentGroup={parentGroup}
      category={category}
      subcategory={subcategory}
      products={products}
    />
  );
}
