import { createClient } from '../../prismicio';
import { PostCard } from '../../components/PostCard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | Legit Cards',
  description: 'Read our latest insights and news.',
};

export default async function BlogPage() {
  const client = createClient();
  
  let posts: any[] = [];
  try {
    // Fetch all documents of type 'blog_post', ordered by publication date (descending)
    posts = await client.getAllByType('blog_post', {
      orderings: [
        { field: 'my.blog_post.publication_date', direction: 'desc' },
        { field: 'document.first_publication_date', direction: 'desc' }
      ]
    });
  } catch (error) {
    console.error("Failed to fetch blog posts. Ensure 'blog_post' type is pushed to Prismic.", error);
  }

  console.log({posts})

  return (
    <main className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Blog</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">Discover our latest news and articles.</p>
      </div>
      
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
             <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No blog posts found. Create one in Prismic to see it here!</p>
      )}
    </main>
  );
}
