import { Product } from '../types';

/**
 * Normalizes text for case-insensitive and whitespace-tolerant comparison.
 */
export function normalizeSearchTerm(term: string): string {
  return term.trim().toLowerCase();
}

/**
 * Decoupled, pure product search filtering function.
 * Matches user query against English and Bengali product names and descriptions,
 * as well as subtitles, identifiers, and categories.
 */
export function filterProductsByQuery(products: Product[], query: string): Product[] {
  if (!query || !query.trim()) {
    return products;
  }

  const rawQuery = normalizeSearchTerm(query);
  const terms = rawQuery.split(/\s+/).filter(Boolean);

  return products.filter((product) => {
    // Collect all searchable text fields for this product
    const searchableFields = [
      product.nameEn || '',
      product.nameBn || '',
      product.subtitleEn || '',
      product.subtitleBn || '',
      product.descriptionEn || '',
      product.descriptionBn || '',
      product.id || '',
      product.slug || '',
      product.category || '',
      ...(product.colors || []),
      ...(product.sizes || []),
      product.materialsStatusEn || '',
      product.materialsStatusBn || '',
    ].map((field) => field.toLowerCase());

    const combinedSearchSpace = searchableFields.join(' ');

    // Require all search terms to be matched across the product's search space
    return terms.every((term) => combinedSearchSpace.includes(term));
  });
}
