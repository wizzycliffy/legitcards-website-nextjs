import { PrismicRichText as BasePrismicRichText } from '@prismicio/react';
import type { ComponentProps } from 'react';

type PrismicRichTextProps = ComponentProps<typeof BasePrismicRichText>;

/**
 * A wrapper for PrismicRichText that adds Tailwind typography styles (`prose`).
 */
export function PrismicRichText({ components, ...props }: PrismicRichTextProps) {
  return (
    <div className="prose prose-slate max-w-none dark:prose-invert">
      <BasePrismicRichText components={components} {...props} />
    </div>
  );
}
