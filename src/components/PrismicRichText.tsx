import { PrismicRichText as BasePrismicRichText } from '@prismicio/react';
import type { ComponentProps } from 'react';

type PrismicRichTextProps = ComponentProps<typeof BasePrismicRichText>;

const defaultComponents = {
  paragraph: ({ children }: { children: React.ReactNode }) => (
    <p className="mb-4 leading-relaxed">{children}</p>
  ),
  heading1: ({ children }: { children: React.ReactNode }) => (
    <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>
  ),
  heading2: ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-2xl font-bold mt-6 mb-3">{children}</h2>
  ),
  heading3: ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-xl font-semibold mt-5 mb-2">{children}</h3>
  ),
  heading4: ({ children }: { children: React.ReactNode }) => (
    <h4 className="text-lg font-semibold mt-4 mb-2">{children}</h4>
  ),
};

/**
 * A wrapper for PrismicRichText that adds Tailwind typography styles (`prose`)
 * and ensures paragraph breaks are properly rendered.
 */
export function PrismicRichText({ components, ...props }: PrismicRichTextProps) {
  return (
    <div className="prose prose-slate max-w-none dark:prose-invert">
      <BasePrismicRichText
        components={{ ...defaultComponents, ...components }}
        {...props}
      />
    </div>
  );
}

