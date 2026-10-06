'use client'

import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { wsGateway } from '@/lib/websocket'
import { QUERY_KEYS } from '@/hooks/useBlogQueries'
import { Comment, PostLikedPayload, PostViewedPayload, CommentLikedPayload } from '@/types/blog'

interface UseBlogWebSocketOptions {
  blogId?: string
  slug?: string
  enabled?: boolean
}

export function useBlogWebSocket({ blogId, slug, enabled = true }: UseBlogWebSocketOptions) {
  const queryClient = useQueryClient()

  useEffect(() => {
    const targetTopicId = blogId || slug
    if (!enabled || !targetTopicId) return

    const topic = `blog:${targetTopicId}`
    wsGateway.subscribe(topic)

    // If blogId is known and different from topic, subscribe to it as well
    if (blogId && targetTopicId !== blogId) {
      wsGateway.subscribe(`blog:${blogId}`)
    }

    // 1. Post liked event
    const unbindLiked = wsGateway.on<PostLikedPayload>('post:liked', (payload) => {
      if (!payload || (payload.blogId !== blogId && payload.blogId !== slug)) return

      const updatePostData = (old: any) => {
        if (!old) return old
        const postData = old.data ? old.data : old
        const updated = {
          ...postData,
          likes: payload.likes,
          _count: {
            ...postData._count,
            likes: payload.likes,
          },
        }
        return old.data ? { ...old, data: updated } : updated
      }

      if (blogId) queryClient.setQueryData(QUERY_KEYS.post(blogId), updatePostData)
      if (slug) queryClient.setQueryData(QUERY_KEYS.post(slug), updatePostData)
    })

    // 2. Post viewed event
    const unbindViewed = wsGateway.on<PostViewedPayload>('post:viewed', (payload) => {
      if (!payload || (payload.blogId !== blogId && payload.blogId !== slug)) return

      const updatePostData = (old: any) => {
        if (!old) return old
        const postData = old.data ? old.data : old
        const updated = {
          ...postData,
          views: payload.views,
        }
        return old.data ? { ...old, data: updated } : updated
      }

      if (blogId) queryClient.setQueryData(QUERY_KEYS.post(blogId), updatePostData)
      if (slug) queryClient.setQueryData(QUERY_KEYS.post(slug), updatePostData)
    })

    // 3. Comment approved event
    const unbindComment = wsGateway.on<Comment>('comment:approved', (newComment) => {
      if (!newComment) return
      const targetId = newComment.blogId || newComment.postId
      if (targetId && targetId !== blogId && targetId !== slug) return

      const updateCommentList = (oldComments: any) => {
        const list = Array.isArray(oldComments)
          ? oldComments
          : (Array.isArray(oldComments?.data) ? oldComments.data : [])

        const newId = newComment.id || newComment._id

        // If this is a nested reply, attach to its parent
        if (newComment.parentId) {
          const attachReply = (items: Comment[]): Comment[] => {
            return items.map((c) => {
              if (c.id === newComment.parentId || c._id === newComment.parentId) {
                const existingReplies = c.replies || []
                const alreadyExists = existingReplies.some((r) => (r.id || r._id) === newId)
                if (alreadyExists) return c
                return {
                  ...c,
                  replies: [...existingReplies, newComment],
                }
              }
              if (Array.isArray(c.replies) && c.replies.length > 0) {
                return {
                  ...c,
                  replies: attachReply(c.replies),
                }
              }
              return c
            })
          }
          return attachReply(list)
        }

        // Top-level comment
        const exists = list.some((c: Comment) => {
          const cId = c.id || c._id
          return cId && cId === newId
        })
        if (exists) return oldComments

        return [newComment, ...list]
      }

      // Append to comments list
      if (blogId) queryClient.setQueryData(QUERY_KEYS.comments(blogId), updateCommentList)
      if (slug && slug !== blogId) queryClient.setQueryData(QUERY_KEYS.comments(slug), updateCommentList)

      // Increment commentsCount in post query
      const updatePostCommentCount = (old: any) => {
        if (!old) return old
        const postData = old.data ? old.data : old
        const currentCount = postData.commentsCount ?? postData._count?.comments ?? 0
        const updated = {
          ...postData,
          commentsCount: currentCount + 1,
          _count: {
            ...postData._count,
            comments: currentCount + 1,
          },
        }
        return old.data ? { ...old, data: updated } : updated
      }

      if (blogId) queryClient.setQueryData(QUERY_KEYS.post(blogId), updatePostCommentCount)
      if (slug) queryClient.setQueryData(QUERY_KEYS.post(slug), updatePostCommentCount)
    })

    // 4. Comment liked event
    const unbindCommentLiked = wsGateway.on<CommentLikedPayload>('comment:liked', (payload) => {
      if (!payload || !payload.commentId) return
      if (payload.blogId && payload.blogId !== blogId && payload.blogId !== slug) return

      const updateCommentLikes = (oldComments: any) => {
        if (!Array.isArray(oldComments)) return oldComments

        const syncLikes = (items: Comment[]): Comment[] => {
          return items.map((c) => {
            if (c.id === payload.commentId || c._id === payload.commentId) {
              return {
                ...c,
                likesCount: payload.likesCount,
                likes: payload.likesCount,
              }
            }
            if (Array.isArray(c.replies) && c.replies.length > 0) {
              return {
                ...c,
                replies: syncLikes(c.replies),
              }
            }
            return c
          })
        }

        return syncLikes(oldComments)
      }

      if (blogId) queryClient.setQueryData(QUERY_KEYS.comments(blogId), updateCommentLikes)
      if (slug && slug !== blogId) queryClient.setQueryData(QUERY_KEYS.comments(slug), updateCommentLikes)
    })

    return () => {
      unbindLiked()
      unbindViewed()
      unbindComment()
      unbindCommentLiked()
      wsGateway.unsubscribe(topic)
      if (blogId && targetTopicId !== blogId) {
        wsGateway.unsubscribe(`blog:${blogId}`)
      }
    }
  }, [blogId, slug, enabled, queryClient])
}
