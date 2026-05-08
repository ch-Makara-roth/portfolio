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
  recommendedPosts: (postId?: string) =>
    ["posts", "recommended", postId] as const,
  comments: (postId: string) => ["comments", postId] as const,
  userPosts: (userId: string) => ["posts", "user", userId] as const,
} as const;

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
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.pagination.page < lastPage.pagination.totalPages) {
        return allPages.length + 1;
      }
      return undefined;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function usePost(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.post(id),
    queryFn: async () => {
      console.log("Fetching post with slug:", id);
      const response = await blogService.getPost(id);
      console.log("Post API response:", response);
      return response.data;
    },
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchInterval: 15000,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
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
      return response.data;
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
    }) => blogService.createComment(comment),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.comments(variables.postId),
      });

      queryClient.setQueryData(
        QUERY_KEYS.post(variables.postId),
        (oldData: any) => {
          if (oldData?.data) {
            return {
              ...oldData,
              data: {
                ...oldData.data,
                commentsCount: oldData.data.commentsCount + 1,
              },
            };
          }
          return oldData;
        },
      );
    },
  });
}

export function useLikePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      const key = `blog_like_${postId}`;
      return blogService.likeArticle({
        article_id: postId,
        action: "like",
        localStorage_key: key,
      });
    },
    onMutate: async (postId: string) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.post(postId) });

      const previousPost = queryClient.getQueryData(QUERY_KEYS.post(postId));

      queryClient.setQueryData(QUERY_KEYS.post(postId), (old: any) => {
        if (old?.data) {
          return {
            ...old,
            data: {
              ...old.data,
              likesCount: old.data.likesCount + 1,
              isLiked: true,
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

export function useUnlikePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      const key = `blog_like_${postId}`;
      return blogService.likeArticle({
        article_id: postId,
        action: "unlike",
        localStorage_key: key,
      });
    },
    onMutate: async (postId: string) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.post(postId) });

      const previousPost = queryClient.getQueryData(QUERY_KEYS.post(postId));

      queryClient.setQueryData(QUERY_KEYS.post(postId), (old: any) => {
        if (old?.data) {
          return {
            ...old,
            data: {
              ...old.data,
              likesCount: Math.max(0, old.data.likesCount - 1),
              isLiked: false,
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
