import { notFound } from 'next/navigation';
import { createClient } from '../../../prismicio';
import { PrismicRichText } from '../../../components/PrismicRichText';
import { asText } from '@prismicio/client';
import { PrismicNextImage } from '@prismicio/next';

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
          if (!description && primary.description) description = asText(primary.description);
          if (!description && primary.some_ma_test_text) description = asText(primary.some_ma_test_text);
        }
      }
    }

    return {
      title: `${title} | Legit Cards`,
      description: description.substring(0, 160) || 'Read our latest blog post.',
    };
  } catch (error) {
    return { title: 'Blog Post Not Found' };
  }
}

export default async function BlogPost({ params }: { params: Promise<Params> }) {
  const { uid } = await params;
  const client = createClient();
  
  try {
    const page = await client.getByUID('blog_post', uid);
    
    let title = 'Untitled';
    let imageField = null;

    if (page.data.slices) {
      for (const slice of page.data.slices) {
        if (slice.primary) {
          const primary = slice.primary as any;
          if (title === 'Untitled' && primary.title) title = asText(primary.title);
          if (!imageField && primary.image?.url) imageField = primary.image;
        }
      }
    }

    const dateStr = page.first_publication_date ? new Date(page.first_publication_date).toLocaleDateString() : 'Unknown';
    
    return (
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{title}</h1>
          <p className="text-gray-500 mb-8 font-medium">
            Published on: {dateStr}
          </p>
          
          {imageField && imageField.url && (
            <div className="relative w-full aspect-[2/1] rounded-xl overflow-hidden mb-12 shadow-sm">
               <PrismicNextImage 
                  field={imageField} 
                  fill 
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 1024px"
               />
            </div>
          )}
        </div>
        
        <div className="bg-white dark:bg-gray-900 rounded-lg md:p-8 flex flex-col gap-8">
          {page.data.slices?.map((slice: any, index: number) => {
             // Basic rendering of available text content in the slice
             const primary = slice.primary as any;
             return (
               <div key={index}>
                 {primary?.description && <PrismicRichText field={primary.description} />}
                 {primary?.some_ma_test_text && <PrismicRichText field={primary.some_ma_test_text} />}
               </div>
             );
          })}
        </div>
      </main>
    );
  } catch (error) {
    notFound();
  }
}
