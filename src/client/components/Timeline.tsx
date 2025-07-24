import { usePostsQuery } from '../api/use-posts.js';

export function Timeline() {
  const { data, isLoading, error } = usePostsQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data || !data.data || data.data.length === 0) {
    return <div>No posts yet</div>;
  }

  return (
    <div>
      {data.data.map((post) => (
        <div key={post.id}>
          <p style={{ whiteSpace: 'pre-wrap' }}>{post.content}</p>
        </div>
      ))}
    </div>
  );
}