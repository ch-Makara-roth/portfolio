'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { PostWithAuthor } from './BlogsPage'
import { Heart, MessageCircle, Repeat, Send } from 'lucide-react'
import Link from 'next/link'

interface BlogPostProps {
  post: PostWithAuthor
}

export function BlogPost({ post }: BlogPostProps) {
  return (
    <Link href={`/blogs/${post.slug}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-bg/30 border border-dimmed/20 rounded-2xl p-4 sm:p-5 md:p-6 mb-4 sm:mb-6 cursor-pointer"
      >
        <div className="flex items-start space-x-3 sm:space-x-4">
          <Image
            src={post.author.avatar || '/avatars/default.png'}
            alt={post.author.username}
            width={40}
            height={40}
            className="rounded-full w-10 h-10 sm:w-11 sm:h-11 object-cover"
          />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-text text-sm sm:text-base">{post.author.username}</p>
              <p className="text-dimmed text-xs sm:text-sm">{new Date(post.createdAt).toLocaleDateString()}</p>
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-text mt-1 mb-2 sm:mb-3 group-hover:text-accent transition-colors leading-tight">
              {post.title}
            </h2>
            <p className="text-dimmed text-sm sm:text-base leading-relaxed line-clamp-3">
              {post.content}
            </p>
            <div className="flex items-center justify-between text-dimmed mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-dimmed/20">
              <div className="flex items-center space-x-1 sm:space-x-2 hover:text-accent transition-colors cursor-pointer">
                <Heart size={18} className="sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm">{post._count.likes}</span>
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2 hover:text-accent transition-colors cursor-pointer">
                <MessageCircle size={18} className="sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm">{post._count.comments}</span>
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2 hover:text-accent transition-colors cursor-pointer">
                <Repeat size={18} className="sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm">0</span>
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2 hover:text-accent transition-colors cursor-pointer">
                <Send size={18} className="sm:w-5 sm:h-5" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
