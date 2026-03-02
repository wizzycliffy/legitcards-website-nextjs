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

    const title = page.data.title ? asText(page.data.title) : 'Blog Post';
    const description = page.data.content
      ? asText(page.data.content).substring(0, 160)
      : '';

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
        <main className="container mx-auto px-4 py-12 max-w-3xl flex-grow">
          {/* Header */}
          <div className="mb-8">
            {page.data.title && (
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
                {asText(page.data.title)}
              </h1>
            )}
            <p className="text-gray-500 mb-8 font-medium">Published on: {dateStr}</p>

            {page.data.featured_image?.url && (
              <div className="relative w-full aspect-[2/1] rounded-xl overflow-hidden mb-12 shadow-sm">
                <PrismicNextImage
                  field={page.data.featured_image}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 1024px"
                />
              </div>
            )}
          </div>

          {/* Main content */}
          {page.data.content && (
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <PrismicRichText field={page.data.content} />
            </div>
          )}
        </main>

        <DownloadAppCTA />
      </div>
    );
  } catch {
    notFound();
  }
}
