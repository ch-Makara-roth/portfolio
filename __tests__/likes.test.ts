import blogApiService from '../lib/api/blogService'
import { isUuid } from '../lib/utils'

describe('likes API', () => {
  const originalFetch = global.fetch
  beforeEach(() => {
    jest.resetAllMocks()
  })
  afterAll(() => {
    global.fetch = originalFetch as any
  })

  test('UUID and MongoDB ObjectId validation', () => {
    expect(isUuid('00000000-0000-0000-0000-000000000000')).toBe(true)
    expect(isUuid('6a87d48ac0f729d54b8667a0')).toBe(true)
    expect(isUuid('1')).toBe(false)
  })

  test('likePost action success', async () => {
    global.fetch = jest.fn().mockResolvedValue({ 
      ok: true, 
      json: () => Promise.resolve({ success: true, message: 'Like registered', data: { hasLiked: true, likes: 5 } }) 
    })
    const res = await blogApiService.likePost('00000000-0000-0000-0000-000000000000', 'like', 'blog_like_key')
    expect(res.success).toBe(true)
    expect(res.data.likes).toBe(5)
    expect(res.data.hasLiked).toBe(true)
  })

  test('unlike action success via likeArticle backward compatibility', async () => {
    const payload = { article_id: '00000000-0000-0000-0000-000000000000', action: 'unlike' as const, localStorage_key: 'blog_like_key' }
    global.fetch = jest.fn().mockResolvedValue({ 
      ok: true, 
      json: () => Promise.resolve({ success: true, data: { hasLiked: false, likes: 4 } }) 
    })
    const res = await blogApiService.likeArticle(payload)
    expect(res.success).toBe(true)
    expect(res.data.likes).toBe(4)
  })

  test('400 invalid request', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 400, statusText: 'Bad Request' })
    await expect(blogApiService.likePost('invalid', 'like')).rejects.toThrow('HTTP error')
  })

  test('404 non-existent article', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 404, statusText: 'Not Found' })
    await expect(blogApiService.likePost('00000000-0000-0000-0000-000000000001', 'like')).rejects.toThrow('HTTP error')
  })
})