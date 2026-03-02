import { PrismicNextImage, PrismicNextLink } from '@prismicio/next';
import { asText } from '@prismicio/client';

export function PostCard({ post }: { post: any }) {
  let title = 'Untitled';
  let excerpt = '';
  let imageField = null;

  // Extract content from slices
  if (post.data.slices) {
    for (const slice of post.data.slices) {
      if (slice.primary) {
        const primary = slice.primary as any;
        // Find title (hero slice)
        if (title === 'Untitled' && primary.title) title = asText(primary.title);
        // Find excerpt - hero description, text_blog body, or call_to_action paragraph
        if (!excerpt && primary.description && primary.description.length > 0) excerpt = asText(primary.description);
        if (!excerpt && primary.for_rich_text && primary.for_rich_text.length > 0) excerpt = asText(primary.for_rich_text);
        if (!excerpt && primary.paragraph && primary.paragraph.length > 0) excerpt = asText(primary.paragraph);
        // Find image
        if (!imageField && primary.image?.url) imageField = primary.image;
      }
    }
  }

  // Fallback excerpt and shorten
  excerpt = excerpt || 'No description available.';
  const shortExcerpt = excerpt.length > 150 ? excerpt.substring(0, 150) + '...' : excerpt;
  const dateStr = post.first_publication_date ? new Date(post.first_publication_date).toLocaleDateString() : 'Unknown Date';

  return (
    <PrismicNextLink document={post} className="group flex flex-col gap-4 p-4 border border-gray-200 dark:border-gray-800 rounded-lg md:hover:shadow-lg transition-shadow bg-white dark:bg-gray-900 cursor-pointer">
      {imageField && imageField.url && (
        <div className="relative w-full aspect-video rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800">
          <PrismicNextImage 
            field={imageField} 
            fill 
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold line-clamp-2 group-hover:text-blue-600 transition-colors">{title}</h2>
        <p className="text-sm text-gray-500">{dateStr}</p>
        <p className="text-gray-700 dark:text-gray-300 line-clamp-3">{shortExcerpt}</p>
      </div>
    </PrismicNextLink>
  );
}
