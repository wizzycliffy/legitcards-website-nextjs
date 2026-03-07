import { notFound } from 'next/navigation';
import { createClient } from '../../../prismicio';
import { PrismicRichText } from '../../../components/PrismicRichText';
import { asText } from '@prismicio/client';
import { PrismicNextImage, PrismicNextLink } from '@prismicio/next';
import { DownloadAppCTA } from '../../../components/shared/DownloadAppCTA';

type Params = { uid: string };

function extractPostData(page: any) {
  let title = 'Blog Post';
  let description = '';
  let mainImage = page.data.featured_image?.url ? page.data.featured_image : null;

  if (page.data.title && page.data.title.length > 0) {
    const text = asText(page.data.title).trim();
    if (text) title = text;
  }
  if (page.data.content && page.data.content.length > 0) {
    const text = asText(page.data.content).trim();
    if (text) description = text.substring(0, 160);
  }

  if (page.data.slices) {
    for (const slice of page.data.slices) {
      if (slice.primary) {
        const primary = slice.primary as any;
        if (title === 'Blog Post' && primary.title && primary.title.length > 0) {
          const text = asText(primary.title).trim();
          if (text) title = text;
        }
        if (!description && primary.description && primary.description.length > 0) {
          const text = asText(primary.description).trim();
          if (text) description = text.substring(0, 160);
        }
        if (!description && primary.for_rich_text && primary.for_rich_text.length > 0) {
          const text = asText(primary.for_rich_text).trim();
          if (text) description = text.substring(0, 160);
        }
        if (!description && primary.paragraph && primary.paragraph.length > 0) {
          const text = asText(primary.paragraph).trim();
          if (text) description = text.substring(0, 160);
        }
        if (!mainImage && primary.image?.url) {
          mainImage = primary.image;
        }
      }
    }
  }

  if (!description && page.data.meta_description) {
    description = page.data.meta_description as string;
  }

  return { title, description, mainImage };
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { uid } = await params;
  const client = createClient();

  try {
    const page = await client.getByUID('blog_post', uid);
    const { title, description } = extractPostData(page);

    return {
      title: `${title} | Legit Cards`,
      description: description || 'Read our latest blog post.',
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
    const { title, mainImage } = extractPostData(page);

    const dateStr = page.data.publication_date
      ? new Date(page.data.publication_date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : page.first_publication_date
        ? new Date(page.first_publication_date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : 'Unknown';

    return (
      <div className="flex flex-col min-h-screen">
        <main className="container mx-auto px-6 lg:px-10 py-12 max-w-3xl flex-grow">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
              {title}
            </h1>
            <p className="text-gray-500 mb-8 font-medium">Published on: {dateStr}</p>

            {mainImage && (
              <div className="relative w-full aspect-[2/1] rounded-xl overflow-hidden mb-12 shadow-sm">
                <PrismicNextImage
                  field={mainImage}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 1024px"
                />
              </div>
            )}
          </div>

          {/* Main content */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            {page.data.content && page.data.content.length > 0 && (
              <PrismicRichText field={page.data.content} />
            )}
            
            {(page.data as any).slices && (page.data as any).slices.map((slice: any, index: number) => {
              if (slice.slice_type === 'hero') {
                return (
                  <div key={index} className="my-6">
                    {slice.primary?.description?.length > 0 && <PrismicRichText field={slice.primary.description} />}
                    {slice.primary?.callToActionLink && (
                       <PrismicNextLink field={slice.primary.callToActionLink} className="mt-4 inline-block bg-[#0A2540] dark:bg-white text-white dark:text-[#0A2540] px-6 py-3 rounded-lg font-medium hover:opacity-90 transition shadow-sm">
                         {slice.primary.callToActionLink.text || 'Get Started'}
                       </PrismicNextLink>
                    )}
                  </div>
                );
              }
              if (slice.slice_type === 'text_blog' && slice.primary?.for_rich_text?.length > 0) {
                return <PrismicRichText key={index} field={slice.primary.for_rich_text} />;
              }
              if (slice.slice_type === 'call_to_action') {
                return (
                  <div key={index} className="my-10 p-8 bg-gray-50 dark:bg-gray-800/50 rounded-2xl flex flex-col items-center text-center border border-gray-100 dark:border-gray-800">
                    {slice.primary?.image?.url ? (
                      <div className="mb-6 relative w-full max-w-md aspect-video rounded-xl overflow-hidden shadow-sm">
                         <PrismicNextImage
                           field={slice.primary.image}
                           fill
                           className="object-cover"
                           sizes="(max-width: 768px) 100vw, 50vw"
                         />
                      </div>
                    ) : null}
                    {slice.primary?.title?.length > 0 && <h3 className="text-2xl font-bold mb-4">{asText(slice.primary.title)}</h3>}
                    {slice.primary?.paragraph?.length > 0 && (
                       <div className="mb-6 text-gray-600 dark:text-gray-300">
                         <PrismicRichText field={slice.primary.paragraph} />
                       </div>
                    )}
                    {slice.primary?.buttonLink && (
                       <PrismicNextLink field={slice.primary.buttonLink} className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium transition shadow-sm">
                         {slice.primary.buttonLink.text || 'Learn More'}
                       </PrismicNextLink>
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
