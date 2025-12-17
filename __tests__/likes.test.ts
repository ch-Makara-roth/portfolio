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

  test('UUID validation', () => {
    expect(isUuid('00000000-0000-0000-0000-000000000000')).toBe(true)
    expect(isUuid('1')).toBe(false)
  })

  test('like action success', async () => {
    const payload = { article_id: '00000000-0000-0000-0000-000000000000', action: 'like' as const, localStorage_key: 'blog_like_key' }
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({ success: true, data: { id: payload.article_id, likes: 5 } }) })
    const res = await blogApiService.likeArticle(payload)
    expect(res.success).toBe(true)
    expect(res.data.likes).toBe(5)
  })

  test('unlike action success', async () => {
    const payload = { article_id: '00000000-0000-0000-0000-000000000000', action: 'unlike' as const, localStorage_key: 'blog_like_key' }
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({ success: true, data: { id: payload.article_id, likes: 4 } }) })
    const res = await blogApiService.likeArticle(payload)
    expect(res.success).toBe(true)
    expect(res.data.likes).toBe(4)
  })

  test('400 invalid request', async () => {
    const payload = { article_id: 'invalid', action: 'like' as const, localStorage_key: 'blog_like_key' }
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 400, statusText: 'Bad Request' })
    await expect(blogApiService.likeArticle(payload)).rejects.toThrow('HTTP error')
  })

  test('404 non-existent article', async () => {
    const payload = { article_id: '00000000-0000-0000-0000-000000000001', action: 'like' as const, localStorage_key: 'blog_like_key' }
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 404, statusText: 'Not Found' })
    await expect(blogApiService.likeArticle(payload)).rejects.toThrow('HTTP error')
  })
})