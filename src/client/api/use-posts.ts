import { useQuery } from '@tanstack/react-query';
import { client } from './client.js';

export const usePostsQuery = () => {
  return useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const res = await client.v1.posts.$get();
      if (!res.ok) {
        throw new Error('Failed to fetch posts');
      }
      return res.json();
    },
  });
};