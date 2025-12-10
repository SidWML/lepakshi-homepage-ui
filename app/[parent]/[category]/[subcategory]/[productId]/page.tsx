import { notFound } from "next/navigation";
import {
  getProductBySlug,
  getCategoryById,
  getCategoryGroupBySlug,
  getRelatedProducts,
} from "@/lib/data/products";
import ProductDetailContent from "./ProductDetailContent";

interface ProductDetailPageProps {
  params: Promise<{ parent: string; category: string; subcategory: string; productId: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { parent: parentSlug, category: categorySlug, subcategory: subcategorySlug, productId } = await params;

  const product = getProductBySlug(productId);

  if (!product) {
    notFound();
  }

  const parentGroup = getCategoryGroupBySlug(parentSlug);
  const category = getCategoryById(product.categoryId);
  const subcategory = category?.subcategories.find(s => s.id === product.subcategoryId);

  // Verify URL matches product data
  if (!parentGroup || !category || category.parentSlug !== parentSlug || category.slug !== categorySlug) {
    notFound();
  }

  if (!subcategory || subcategory.slug !== subcategorySlug) {
    notFound();
  }

  const relatedProducts = getRelatedProducts(product, 4);

  return (
    <ProductDetailContent
      product={product}
      parentGroup={parentGroup}
      category={category}
      subcategory={subcategory}
      relatedProducts={relatedProducts}
    />
  );
}
