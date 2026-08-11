import { PortableText } from '@portabletext/react';
import { PortableTextBlock } from '@portabletext/types';
import { portableTextComponents } from '@/lib/sanity/portableText';

interface ProductDescriptionProps {
  content: PortableTextBlock[];
}

export default function ProductDescription({ content }: ProductDescriptionProps) {
  return (
    <div className="prose prose-lg max-w-none">
      <h2 className="type-h4 text-ivory mb-4">
        About This Piece
      </h2>
      <PortableText value={content} components={portableTextComponents} />
    </div>
  );
}
