import { createClient } from '../../prismicio';
import { Metadata } from 'next';
import { BlogListWithFilters } from '../../components/blog/BlogListWithFilters';
import { MainLayout } from '../../components/layout/MainLayout';
import { DownloadAppCTA } from '../../components/shared/DownloadAppCTA';

export const metadata: Metadata = {
  title: 'Legitcards Blog | Legit Cards',
  description: 'Read our latest insights and news.',
};

export default async function BlogPage() {
  const client = createClient();
  
  let posts: any[] = [];
  try {
    posts = await client.getAllByType('blog_post', {
      orderings: [
        { field: 'my.blog_post.publication_date', direction: 'desc' },
        { field: 'document.first_publication_date', direction: 'desc' }
      ]
    });
  } catch (error) {
    console.error("Failed to fetch blog posts. Ensure 'blog_post' type is pushed to Prismic.", error);
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-6 lg:px-10 py-12 max-w-6xl">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Legitcards Blog</h1>
          <p className="text-lg text-muted-foreground">Discover our latest news and articles.</p>
        </div>
        
        {posts.length > 0 ? (
          <BlogListWithFilters posts={posts} />
        ) : (
          <p className="text-muted-foreground">No blog posts found. Create one in Prismic to see it here!</p>
        )}
      </div>
      <DownloadAppCTA />
    </MainLayout>
  );
}
