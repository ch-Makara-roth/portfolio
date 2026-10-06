import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { blogApiService } from "@/lib/api/blogService";
import {
  BlogPost,
  BlogQueryParams,
  Comment,
  CreateCommentRequest,
} from "@/types/blog";

const blogService = blogApiService;

export const QUERY_KEYS = {
  posts: ["posts"] as const,
  post: (id: string) => ["posts", id] as const,
  featuredPosts: (limit?: number) => ["posts", "featured", limit] as const,
  trendingPosts: (limit?: number) => ["posts", "trending", limit] as const,
  tags: ["posts", "tags"] as const,
  relatedPosts: (idOrSlug: string) => ["posts", "related", idOrSlug] as const,
  recommendedPosts: (postId?: string) =>
    ["posts", "recommended", postId] as const,
  comments: (postId: string) => ["comments", postId] as const,
  likeStatus: (idOrSlug: string) => ["posts", "like-status", idOrSlug] as const,
  userPosts: (userId: string) => ["posts", "user", userId] as const,
  health: ["system", "health"] as const,
} as const;

export function useHealthCheck() {
  return useQuery({
    queryKey: QUERY_KEYS.health,
    queryFn: () => blogService.checkHealth(),
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

export function usePosts(params?: BlogQueryParams) {
  return useQuery({
    queryKey: [...QUERY_KEYS.posts, params],
    queryFn: () => blogService.getPosts(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useInfinitePosts(params?: BlogQueryParams) {
  return useInfiniteQuery({
    queryKey: [...QUERY_KEYS.posts, "infinite", params],
    queryFn: ({ pageParam = 1 }) =>
      blogService.getPosts({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const meta = lastPage.meta || lastPage.pagination;
      if (meta && meta.page < meta.totalPages) {
        return meta.page + 1;
      }
      return undefined;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function usePost(idOrSlug: string) {
  return useQuery({
    queryKey: QUERY_KEYS.post(idOrSlug),
    queryFn: async () => {
      const response = await blogService.getPost(idOrSlug);
      return response.data;
    },
    enabled: !!idOrSlug,
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

export function usePostLikeStatus(idOrSlug: string, enabled: boolean = true) {
  return useQuery({
    queryKey: QUERY_KEYS.likeStatus(idOrSlug),
    queryFn: async () => {
      const res = await blogService.getLikeStatus(idOrSlug);
      return res.data;
    },
    enabled: !!idOrSlug && enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useFeaturedPosts(limit: number = 5) {
  return useQuery({
    queryKey: QUERY_KEYS.featuredPosts(limit),
    queryFn: () => blogService.getFeaturedPosts(limit),
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
}

export function useTrendingPosts(limit: number = 5) {
  return useQuery({
    queryKey: QUERY_KEYS.trendingPosts(limit),
    queryFn: () => blogService.getTrendingPosts(limit),
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
}

export function useBlogTags() {
  return useQuery({
    queryKey: QUERY_KEYS.tags,
    queryFn: async () => {
      const response = await blogService.getTags();
      return response.data || [];
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  });
}

export function useRelatedPosts(idOrSlug: string) {
  return useQuery({
    queryKey: QUERY_KEYS.relatedPosts(idOrSlug),
    queryFn: () => blogService.getRelatedPosts(idOrSlug),
    enabled: !!idOrSlug,
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
}

export function useRecommendedPosts(postId?: string, limit: number = 3) {
  return useQuery({
    queryKey: [...QUERY_KEYS.recommendedPosts(postId), limit],
    queryFn: () => blogService.getRecommendedPosts(postId!, limit),
    enabled: !!postId,
    staleTime: 15 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  });
}

export function useComments(postId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.comments(postId),
    queryFn: async () => {
      const response = await blogService.getComments(postId);
      return response.data || [];
    },
    enabled: !!postId,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      postId,
      comment,
    }: {
      postId: string;
      comment: CreateCommentRequest;
    }) => blogService.createComment(postId, comment),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.comments(variables.postId),
      });

      // If approved immediately or for optimistic counts
      if (response?.data?.status === "APPROVED") {
        queryClient.setQueryData(
          QUERY_KEYS.post(variables.postId),
          (oldData: any) => {
            if (!oldData) return oldData;
            const postData = oldData.data ? oldData.data : oldData;
            const currentCount = postData.commentsCount ?? postData._count?.comments ?? 0;
            const updated = {
              ...postData,
              commentsCount: currentCount + 1,
              _count: {
                ...postData._count,
                comments: currentCount + 1,
              },
            };
            return oldData.data ? { ...oldData, data: updated } : updated;
          },
        );
      }
    },
  });
}

export function useLikeComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      idOrSlug,
      commentId,
      action = 'toggle',
      fingerprint,
    }: {
      idOrSlug: string;
      commentId: string;
      action?: 'toggle' | 'like' | 'unlike';
      fingerprint?: string;
    }) => {
      return blogService.likeComment(idOrSlug, commentId, action, fingerprint);
    },
    onMutate: async ({ idOrSlug, commentId, action = 'toggle' }) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.comments(idOrSlug) });
      const previousComments = queryClient.getQueryData(QUERY_KEYS.comments(idOrSlug));

      // Optimistically update comment likes
      queryClient.setQueryData(QUERY_KEYS.comments(idOrSlug), (old: any) => {
        if (!Array.isArray(old)) return old;

        const updateLikes = (items: any[]): any[] => {
          return items.map((c) => {
            const isMatch = (c.id === commentId || c._id === commentId);
            if (isMatch) {
              const currentLikes = c.likesCount ?? c.likes ?? 0;
              const hasLiked = c.hasLiked;
              const nextLiked = action === 'toggle' ? !hasLiked : action === 'like';
              const nextLikes = Math.max(0, currentLikes + (nextLiked ? 1 : -1));
              return {
                ...c,
                hasLiked: nextLiked,
                likesCount: nextLikes,
                likes: nextLikes,
              };
            }
            if (Array.isArray(c.replies) && c.replies.length > 0) {
              return {
                ...c,
                replies: updateLikes(c.replies),
              };
            }
            return c;
          });
        };

        return updateLikes(old);
      });

      return { previousComments };
    },
    onError: (_err, { idOrSlug }, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(QUERY_KEYS.comments(idOrSlug), context.previousComments);
      }
    },
    onSettled: (_data, _err, { idOrSlug }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.comments(idOrSlug) });
    },
  });
}

export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ commentId }: { commentId: string; idOrSlug: string }) => {
      return blogService.deleteComment(commentId);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.comments(variables.idOrSlug) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.post(variables.idOrSlug) });
    },
  });
}

export function useLikePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (args: string | { idOrSlug: string; action?: 'toggle' | 'like' | 'unlike'; fingerprint?: string }) => {
      const idOrSlug = typeof args === 'string' ? args : args.idOrSlug;
      const action = typeof args === 'string' ? 'toggle' : (args.action || 'toggle');
      const fingerprint = typeof args === 'string' ? undefined : args.fingerprint;
      return blogService.likePost(idOrSlug, action, fingerprint);
    },
    onSuccess: (data, args) => {
      const idOrSlug = typeof args === 'string' ? args : args.idOrSlug;
      
      // Update like status query
      queryClient.setQueryData(QUERY_KEYS.likeStatus(idOrSlug), {
        hasLiked: data.data.hasLiked,
        likes: data.data.likes,
      });

      // Update post cache
      queryClient.setQueryData(QUERY_KEYS.post(idOrSlug), (oldData: any) => {
        if (!oldData) return oldData;
        const postData = oldData.data ? oldData.data : oldData;
        const updated = {
          ...postData,
          likes: data.data.likes,
          _count: {
            ...postData._count,
            likes: data.data.likes,
          },
        };
        return oldData.data ? { ...oldData, data: updated } : updated;
      });

      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.posts });
    },
  });
}

export function useUnlikePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      return blogService.likePost(postId, 'unlike');
    },
    onSuccess: (data, postId) => {
      queryClient.setQueryData(QUERY_KEYS.likeStatus(postId), {
        hasLiked: false,
        likes: data.data.likes,
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.post(postId) });
    },
  });
}

export function useTrackView() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ idOrSlug, fingerprint }: { idOrSlug: string; fingerprint?: string }) => {
      return blogService.trackView(idOrSlug, fingerprint);
    },
    onSuccess: (res, variables) => {
      queryClient.setQueryData(QUERY_KEYS.post(variables.idOrSlug), (old: any) => {
        if (!old) return old;
        const postData = old.data ? old.data : old;
        const updated = {
          ...postData,
          views: res.data.views,
        };
        return old.data ? { ...old, data: updated } : updated;
      });
    },
  });
}

export function useTrackShare() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (idOrSlug: string) => {
      return blogService.trackShare(idOrSlug);
    },
    onSuccess: (res, idOrSlug) => {
      queryClient.setQueryData(QUERY_KEYS.post(idOrSlug), (old: any) => {
        if (!old) return old;
        const postData = old.data ? old.data : old;
        const updated = {
          ...postData,
          shares: res.data.shares,
        };
        return old.data ? { ...old, data: updated } : updated;
      });
    },
  });
}

export function useBookmarkPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => blogService.bookmarkPost(postId),
    onMutate: async (postId: string) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.post(postId) });

      const previousPost = queryClient.getQueryData(QUERY_KEYS.post(postId));

      queryClient.setQueryData(QUERY_KEYS.post(postId), (old: any) => {
        if (old?.data) {
          return {
            ...old,
            data: {
              ...old.data,
              isBookmarked: true,
            },
          };
        }
        return old;
      });

      return { previousPost };
    },
    onError: (err, postId, context) => {
      if (context?.previousPost) {
        queryClient.setQueryData(QUERY_KEYS.post(postId), context.previousPost);
      }
    },
    onSettled: (data, error, postId) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.post(postId) });
    },
  });
}

export function useUnbookmarkPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => blogService.unbookmarkPost(postId),
    onMutate: async (postId: string) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.post(postId) });

      const previousPost = queryClient.getQueryData(QUERY_KEYS.post(postId));

      queryClient.setQueryData(QUERY_KEYS.post(postId), (old: any) => {
        if (old?.data) {
          return {
            ...old,
            data: {
              ...old.data,
              isBookmarked: false,
            },
          };
        }
        return old;
      });

      return { previousPost };
    },
    onError: (err, postId, context) => {
      if (context?.previousPost) {
        queryClient.setQueryData(QUERY_KEYS.post(postId), context.previousPost);
      }
    },
    onSettled: (data, error, postId) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.post(postId) });
    },
  });
}

export function usePrefetchPost() {
  const queryClient = useQueryClient();

  return (postId: string) => {
    queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.post(postId),
      queryFn: () => blogService.getPost(postId),
      staleTime: 10 * 60 * 1000,
    });
  };
}

export function usePrefetchRecommendedPosts() {
  const queryClient = useQueryClient();

  return (postId: string, limit: number = 3) => {
    queryClient.prefetchQuery({
      queryKey: [...QUERY_KEYS.recommendedPosts(postId), limit],
      queryFn: () => blogService.getRecommendedPosts(postId, limit),
      staleTime: 15 * 60 * 1000,
    });
  };
}
