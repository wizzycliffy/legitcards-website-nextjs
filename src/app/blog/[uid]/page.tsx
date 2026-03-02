import { notFound } from 'next/navigation';
import { createClient } from '../../../prismicio';
import { PrismicRichText } from '../../../components/PrismicRichText';
import { asText } from '@prismicio/client';
import { PrismicNextImage } from '@prismicio/next';
import { DownloadAppCTA } from '../../../components/shared/DownloadAppCTA';

type Params = { uid: string };

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { uid } = await params;
  const client = createClient();

  try {
    const page = await client.getByUID('blog_post', uid);

    let title = 'Blog Post';
    let description = '';

    if (page.data.slices) {
      for (const slice of page.data.slices) {
        if (slice.primary) {
          const primary = slice.primary as any;
          if (title === 'Blog Post' && primary.title) title = asText(primary.title);
          if (!description && primary.description?.length > 0) description = asText(primary.description);
          if (!description && primary.for_rich_text?.length > 0) description = asText(primary.for_rich_text);
        }
      }
    }

    return {
      title: `${title} | Legit Cards`,
      description: description.substring(0, 160) || 'Read our latest blog post.',
    };
  } catch {
    return { title: 'Blog Post Not Found' };
  }
}

export default async function BlogPost({ params }: { params: Promise<Params> }) {
  const { uid } = await params;
  const client = createClient();

  try {
    const page = await client.getByUID('blog_post', uid);

    let title = 'Untitled';
    let heroImage: any = null;

    // Extract title and hero image from the hero slice
    if (page.data.slices) {
      for (const slice of page.data.slices) {
        if (slice.primary) {
          const primary = slice.primary as any;
          if (title === 'Untitled' && primary.title) title = asText(primary.title);
          if (!heroImage && primary.image?.url && slice.slice_type === 'hero') heroImage = primary.image;
        }
      }
    }

    const dateStr = page.first_publication_date
      ? new Date(page.first_publication_date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : 'Unknown';

    return (
      <div className="flex flex-col min-h-screen">
        <main className="container mx-auto px-4 py-12 max-w-3xl flex-grow">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{title}</h1>
            <p className="text-gray-500 mb-8 font-medium">Published on: {dateStr}</p>

            {heroImage?.url && (
              <div className="relative w-full aspect-[2/1] rounded-xl overflow-hidden mb-12 shadow-sm">
                <PrismicNextImage
                  field={heroImage}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 1024px"
                />
              </div>
            )}
          </div>

          {/* Slice content */}
          <div className="flex flex-col gap-10">
            {page.data.slices?.map((slice: any, index: number) => {
              const primary = slice.primary as any;

              // hero slice – render description if present (title/image already shown above)
              if (slice.slice_type === 'hero') {
                return primary?.description?.length > 0 ? (
                  <div key={index} className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                    <PrismicRichText field={primary.description} />
                  </div>
                ) : null;
              }

              // text_blog slice – main body content lives in for_rich_text
              if (slice.slice_type === 'text_blog') {
                return primary?.for_rich_text?.length > 0 ? (
                  <div key={index} className="prose prose-lg dark:prose-invert max-w-none">
                    <PrismicRichText field={primary.for_rich_text} />
                  </div>
                ) : null;
              }

              // call_to_action slice – inline image + paragraph
              if (slice.slice_type === 'call_to_action') {
                return (
                  <div
                    key={index}
                    className="rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900"
                  >
                    {primary?.image?.url && (
                      <div className="relative w-full aspect-video">
                        <PrismicNextImage
                          field={primary.image}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 100vw, 768px"
                        />
                      </div>
                    )}
                    {primary?.paragraph?.length > 0 && (
                      <div className="p-6 text-gray-700 dark:text-gray-300">
                        <PrismicRichText field={primary.paragraph} />
                      </div>
                    )}
                  </div>
                );
              }

              return null;
            })}
          </div>
        </main>

        <DownloadAppCTA />
      </div>
    );
  } catch {
    notFound();
  }
}
