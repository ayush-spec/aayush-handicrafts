'use client';

import { useSearchParams } from 'next/navigation';
import { Category } from '@/types/sanity';

interface CategoryFilterProps {
  categories: Category[];
}

export default function CategoryFilter({ categories }: CategoryFilterProps) {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category');

  const handleCategoryClick = (slug: string | null) => {
    if (slug) {
      window.location.href = `/shop?category=${slug}`;
    } else {
      window.location.href = '/shop';
    }
  };

  return (
    <div className="flex flex-wrap gap-3 mb-2 justify-center">
      <button
        onClick={() => handleCategoryClick(null)}
        className={`px-3.5 py-1.5 rounded-sm transition-all font-medium text-sm ${
          !activeCategory
            ? 'bg-tertiary text-white shadow-sm'
            : 'bg-secondary text-ivory/75 hover:bg-gray-200'
        }`}
      >
        All
      </button>

      {categories.map((category) => (
        <button
          key={category._id}
          onClick={() => handleCategoryClick(category.slug.current)}
          className={`px-3.5 py-1.5 rounded-sm transition-all font-medium text-sm ${
            activeCategory === category.slug.current
              ? 'bg-tertiary text-white shadow-sm'
              : 'bg-secondary text-ivory/75 hover:bg-gray-200'
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
