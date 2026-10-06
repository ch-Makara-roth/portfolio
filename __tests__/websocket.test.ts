import { WebSocketGateway } from '@/lib/websocket'

describe('WebSocketGateway', () => {
  let mockWebSocket: any
  let gateway: WebSocketGateway

  beforeEach(() => {
    mockWebSocket = {
      readyState: 1, // OPEN
      send: jest.fn(),
      close: jest.fn(),
      onopen: null,
      onmessage: null,
      onclose: null,
      onerror: null,
    }

    global.WebSocket = jest.fn().mockImplementation(() => mockWebSocket) as any
    gateway = new WebSocketGateway('ws://localhost:5050/ws')
  })

  afterEach(() => {
    gateway.disconnect()
    jest.restoreAllMocks()
  })

  test('connects and sends subscription message on open', () => {
    gateway.subscribe('blog:66c5fa9021b369c0d604b321')
    
    // Trigger onopen
    if (mockWebSocket.onopen) {
      mockWebSocket.onopen()
    }

    expect(mockWebSocket.send).toHaveBeenCalledWith(
      JSON.stringify({
        type: 'subscribe',
        payload: { topic: 'blog:66c5fa9021b369c0d604b321' }
      })
    )
  })

  test('dispatches post:liked events to listeners', () => {
    const handler = jest.fn()
    gateway.on('post:liked', handler)

    gateway.connect()
    if (mockWebSocket.onopen) mockWebSocket.onopen()

    // Simulate incoming message
    if (mockWebSocket.onmessage) {
      mockWebSocket.onmessage({
        data: JSON.stringify({
          event: 'post:liked',
          payload: { blogId: '66c5fa9021b369c0d604b321', likes: 245 }
        })
      })
    }

    expect(handler).toHaveBeenCalledWith({
      blogId: '66c5fa9021b369c0d604b321',
      likes: 245
    })
  })

  test('unsubscribes and unregisters listeners cleanly', () => {
    const handler = jest.fn()
    const unbind = gateway.on('post:viewed', handler)

    gateway.connect()
    if (mockWebSocket.onopen) mockWebSocket.onopen()

    gateway.unsubscribe('blog:66c5fa9021b369c0d604b321')
    expect(mockWebSocket.send).toHaveBeenCalledWith(
      JSON.stringify({
        type: 'unsubscribe',
        payload: { topic: 'blog:66c5fa9021b369c0d604b321' }
      })
    )

    unbind()
    if (mockWebSocket.onmessage) {
      mockWebSocket.onmessage({
        data: JSON.stringify({
          event: 'post:viewed',
          payload: { blogId: '66c5fa9021b369c0d604b321', views: 500 }
        })
      })
    }

    expect(handler).not.toHaveBeenCalled()
  })

  test('dispatches comment:approved events to listeners and attaches topic blogId if missing', () => {
    const handler = jest.fn()
    gateway.on('comment:approved', handler)

    gateway.connect()
    if (mockWebSocket.onopen) mockWebSocket.onopen()

    if (mockWebSocket.onmessage) {
      mockWebSocket.onmessage({
        data: JSON.stringify({
          event: 'comment:approved',
          topic: 'blog:66c5fa9021b369c0d604b321',
          payload: {
            _id: '66c5fa9021b369c0d604b999',
            authorName: 'Jane Reader',
            content: 'Great post!',
            status: 'APPROVED',
            createdAt: '2026-08-24T16:35:00.000Z'
          }
        })
      })
    }

    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({
        _id: '66c5fa9021b369c0d604b999',
        blogId: '66c5fa9021b369c0d604b321',
        authorName: 'Jane Reader',
        content: 'Great post!',
        status: 'APPROVED'
      })
    )
  })
})
