import { parseText } from '../../shared/parse-text.js';
import { usePostsQuery } from '../api/use-posts.js';
import { TreeRenderer } from './tree-renderer.js';
import { useEffect, useRef } from 'react';

import "./timeline.css"

function PostTime({dateTime}: {dateTime: string}) {
  const date = new Date(dateTime)
  const current = new Date()
  const isSameDate = date.getFullYear() === current.getFullYear() && date.getMonth() === current.getMonth() && date.getDate() === current.getDate();
  const ymd = isSameDate ? '' : `${date.getFullYear() === current.getFullYear() ? "" : date.getFullYear() + "/"}${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
  const hms = `${date.getHours().toString().padStart(ymd.length ? 2 : 0, "0")}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`
  return <time dateTime={dateTime} className='post-time'>
    {ymd} {hms}
  </time>
}

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
    <div ref={timelineRef} className="timeline">
      {data.data.slice().reverse().map((post) => (
        <div key={post.id}>
          <PostTime dateTime={post.createdAt} />
          <TreeRenderer tree={parseText(post.content)} />
        </div>
      ))}
    </div>
  );
}