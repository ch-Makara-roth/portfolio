import blogApiService from '@/lib/api/blogService'

describe('BlogApiService', () => {
  const originalFetch = global.fetch

  beforeEach(() => {
    jest.resetAllMocks()
  })

  afterAll(() => {
    global.fetch = originalFetch
  })

  test('checkHealth returns system status', async () => {
    const mockHealthResponse = {
      success: true,
      data: {
        status: 'ONLINE',
        runtime: 'Bun 1.4.0',
        timestamp: '2026-08-21T11:45:00.000Z',
        service: 'Portfolio CMS & Real-Time API'
      }
    }

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockHealthResponse)
    })

    const res = await blogApiService.checkHealth()
    expect(res.success).toBe(true)
    expect(res.data.status).toBe('ONLINE')
  })

  test('getPosts normalizes MongoDB response correctly', async () => {
    const mockApiResponse = {
      success: true,
      data: [
        {
          _id: '6a87d48ac0f729d54b8667a0',
          title: 'Architecting NestJS Microservices',
          slug: 'architecting-enterprise-nestjs-microservices',
          excerpt: 'Production patterns for NestJS',
          content: '# Markdown content',
          coverImage: 'http://localhost:5050/uploads/covers/test.jpg',
          author: {
            name: 'Makara Roth',
            title: 'Lead Architect',
            avatar: 'http://localhost:5050/avatars/user.jpg'
          },
          tags: ['NestJS', 'Microservices'],
          views: 120,
          likes: 15,
          commentsCount: 3,
          readingTime: 8,
          publishedAt: '2026-08-20T00:00:00Z',
          createdAt: '2026-08-19T00:00:00Z'
        }
      ],
      meta: {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1
      }
    }

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockApiResponse)
    })

    const response = await blogApiService.getPosts({ page: 1, limit: 10 })

    expect(response.data).toHaveLength(1)
    const post = response.data[0]
    expect(post.id).toBe('6a87d48ac0f729d54b8667a0')
    expect(post._id).toBe('6a87d48ac0f729d54b8667a0')
    expect(post.image).toBe('http://localhost:5050/uploads/covers/test.jpg')
    expect(post.readingTime).toBe(8)
    expect(post._count?.comments).toBe(3)
    expect(post._count?.likes).toBe(15)
    expect(response.pagination?.total).toBe(1)
    expect(response.meta?.totalPages).toBe(1)
  })

  test('getPost fetches a single article by slug', async () => {
    const mockPostResponse = {
      success: true,
      data: {
        _id: '6a87d48ac0f729d54b8667a0',
        title: 'Architecting NestJS Microservices',
        slug: 'architecting-enterprise-nestjs-microservices',
        content: '# Full Post Content',
        author: { name: 'Makara Roth' },
        views: 250,
        likes: 20
      }
    }

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockPostResponse)
    })

    const res = await blogApiService.getPost('architecting-enterprise-nestjs-microservices')
    expect(res.data.id).toBe('6a87d48ac0f729d54b8667a0')
    expect(res.data.title).toBe('Architecting NestJS Microservices')
  })

  test('getFeaturedPosts and getTrendingPosts fetch collections', async () => {
    const mockFeedResponse = {
      success: true,
      data: [{ _id: 'post1', title: 'Featured Post 1', slug: 'featured-1', author: { name: 'Makara' } }]
    }

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockFeedResponse)
    })

    const featured = await blogApiService.getFeaturedPosts(3)
    expect(featured.data).toHaveLength(1)
    expect(featured.data[0].id).toBe('post1')

    const trending = await blogApiService.getTrendingPosts(3)
    expect(trending.data).toHaveLength(1)
  })

  test('getTags returns tags list with counts', async () => {
    const mockTagsResponse = {
      success: true,
      data: [
        { tag: 'NestJS', count: 5 },
        { tag: 'Architecture', count: 3 }
      ]
    }

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockTagsResponse)
    })

    const tagsRes = await blogApiService.getTags()
    expect(tagsRes.data).toHaveLength(2)
    expect(tagsRes.data[0].tag).toBe('NestJS')
    expect(tagsRes.data[0].count).toBe(5)
  })

  test('getRelatedPosts calls related endpoint and normalizes results', async () => {
    const mockRelatedResponse = {
      success: true,
      data: [
        {
          _id: '6a87d48ac0f729d54b8667a1',
          title: 'NestJS Security Deep Dive',
          slug: 'nestjs-security-deep-dive',
          author: { name: 'Makara Roth' }
        }
      ]
    }

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockRelatedResponse)
    })

    const response = await blogApiService.getRelatedPosts('architecting-enterprise-nestjs-microservices')
    expect(response.data).toHaveLength(1)
    expect(response.data[0].id).toBe('6a87d48ac0f729d54b8667a1')
  })

  test('likePost and getLikeStatus manage likes with fingerprint', async () => {
    const mockLikeResponse = {
      success: true,
      message: 'Like registered',
      data: { hasLiked: true, likes: 243 }
    }

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockLikeResponse)
    })

    const likeRes = await blogApiService.likePost('test-post', 'like', 'custom_fp')
    expect(likeRes.data.hasLiked).toBe(true)
    expect(likeRes.data.likes).toBe(243)

    const mockStatusResponse = {
      success: true,
      data: { hasLiked: true, likes: 243 }
    }
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockStatusResponse)
    })

    const statusRes = await blogApiService.getLikeStatus('test-post', 'custom_fp')
    expect(statusRes.data.hasLiked).toBe(true)
  })

  test('trackView and trackShare track metrics', async () => {
    global.fetch = jest.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, message: 'View tracked', data: { views: 2891 } })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, message: 'Share registered', data: { shares: 89 } })
      })

    const viewRes = await blogApiService.trackView('test-post', 'fp_123')
    expect(viewRes.data.views).toBe(2891)

    const shareRes = await blogApiService.trackShare('test-post')
    expect(shareRes.data.shares).toBe(89)
  })

  test('getComments and createComment manage comments', async () => {
    const mockCommentsResponse = {
      success: true,
      data: [
        {
          _id: 'c1',
          blogId: 'post1',
          authorName: 'Marcus Brody',
          authorEmail: 'marcus@test.com',
          content: 'Great article!',
          status: 'APPROVED',
          createdAt: '2026-08-12T07:15:00.000Z'
        }
      ]
    }

    global.fetch = jest.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockCommentsResponse)
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          message: 'Your comment has been submitted and is awaiting moderation.',
          data: {
            _id: 'c2',
            status: 'PENDING',
            authorName: 'Sarah',
            content: 'Nice writeup!',
            createdAt: '2026-08-21T11:50:00.000Z'
          }
        })
      })

    const comments = await blogApiService.getComments('post1')
    expect(comments.data).toHaveLength(1)
    expect(comments.data[0]._id).toBe('c1')

    const newComment = await blogApiService.createComment('post1', {
      authorName: 'Sarah',
      authorEmail: 'sarah@test.com',
      content: 'Nice writeup!'
    })
    expect(newComment.data.status).toBe('PENDING')
  })

  test('submitContactForm posts message to forms endpoint', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        success: true,
        message: 'Thank you! Your message has been received.',
        data: { id: 'msg_123' }
      })
    })

    const res = await blogApiService.submitContactForm({
      name: 'Michael',
      email: 'michael@test.com',
      subject: 'Consulting',
      message: 'Hello'
    })

    expect(res.success).toBe(true)
    expect(res.data.id).toBe('msg_123')
  })
})
