import { parseText } from '../../shared/parse-text.js';
import { usePostsQuery } from '../api/use-posts.js';
import { TreeRenderer } from './tree-renderer.js';
import { useEffect, useRef } from 'react';

export function Timeline() {
  const { data, isLoading, error } = usePostsQuery();
  const timelineRef = useRef<HTMLDivElement>(null);
  const prevPostCountRef = useRef(0);

  useEffect(() => {
    if (data?.data && data.data.length > prevPostCountRef.current) {
      // 新しい投稿が追加されたら最下部にスクロール
      if (timelineRef.current) {
        timelineRef.current.scrollTop = timelineRef.current.scrollHeight;
      }
      prevPostCountRef.current = data.data.length;
    }
  }, [data]);

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
    <div ref={timelineRef} style={{ overflowY: 'auto', maxHeight: '80vh' }}>
      {data.data.slice().reverse().map((post) => (
        <div key={post.id}>
          <TreeRenderer tree={parseText(post.content)} />
        </div>
      ))}
    </div>
  );
}